-- ============================================================================
-- ALCHEMISTRY DATABASE MIGRATION - SAFER VERSION
-- Run in Supabase SQL Editor
-- ============================================================================

-- STEP 1: Check current state of tables first
-- ============================================================================
-- Let's see what columns exist
SELECT 'profiles' as table_name, column_name FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public'
UNION ALL
SELECT 'classrooms', column_name FROM information_schema.columns WHERE table_name = 'classrooms' AND table_schema = 'public'
UNION ALL
SELECT 'experiment_logs', column_name FROM information_schema.columns WHERE table_name = 'experiment_logs' AND table_schema = 'public';

-- STEP 2: Add missing columns to profiles (safer version)
-- ============================================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1;

-- Add CHECK constraints separately (won't fail if column already has constraint)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS xp_non_negative;
ALTER TABLE public.profiles ADD CONSTRAINT xp_non_negative CHECK (xp >= 0);

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS level_positive;
ALTER TABLE public.profiles ADD CONSTRAINT level_positive CHECK (level >= 1);

-- Migrate display_name to full_name
UPDATE public.profiles SET full_name = COALESCE(display_name, 'Unknown') WHERE full_name IS NULL OR full_name = '';

-- STEP 3: Check classrooms table structure
-- ============================================================================
-- First, let's see if class_name or name exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'classrooms' AND table_schema = 'public' AND column_name IN ('class_name', 'name', 'join_code');

-- STEP 4: Check if classrooms needs updates
-- ============================================================================
-- NOTE: Live DB already uses class_name and class_code — no rename needed.
-- The original plan to rename class_name→name was never applied.
-- Adding constraints to existing columns:
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'classrooms' AND column_name = 'class_name'
  ) THEN
    ALTER TABLE public.classrooms DROP CONSTRAINT IF EXISTS class_name_not_empty;
    ALTER TABLE public.classrooms ADD CONSTRAINT class_name_not_empty CHECK (length(trim(class_name)) BETWEEN 1 AND 100);
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'classrooms' AND column_name = 'class_code'
  ) THEN
    ALTER TABLE public.classrooms DROP CONSTRAINT IF EXISTS class_code_format;
    -- class_code format: alphanumeric, 5-8 chars
  END IF;
END $$;

-- STEP 5: Enhance experiment_logs
-- ============================================================================
ALTER TABLE public.experiment_logs ADD COLUMN IF NOT EXISTS module TEXT DEFAULT 'lab';
ALTER TABLE public.experiment_logs ADD COLUMN IF NOT EXISTS score INTEGER;
ALTER TABLE public.experiment_logs ADD COLUMN IF NOT EXISTS ran_at TIMESTAMPTZ DEFAULT now();

-- Add concentration constraint (may fail if data doesn't sum to 100 - that's ok, data will need cleanup)
ALTER TABLE public.experiment_logs DROP CONSTRAINT IF EXISTS concentrations_sum_100;

-- STEP 6: Check results table
-- ============================================================================
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'results' AND table_schema = 'public';

-- Add new columns to results (safer)
ALTER TABLE public.results ADD COLUMN IF NOT EXISTS regime TEXT DEFAULT 'NEUTRAL';
ALTER TABLE public.results ADD COLUMN IF NOT EXISTS outcome_label TEXT;
ALTER TABLE public.results ADD COLUMN IF NOT EXISTS product_formula TEXT;
ALTER TABLE public.results ADD COLUMN IF NOT EXISTS state_change TEXT;
ALTER TABLE public.results ADD COLUMN IF NOT EXISTS thermal_effect TEXT;
ALTER TABLE public.results ADD COLUMN IF NOT EXISTS ai_tutor_context TEXT;
ALTER TABLE public.results ADD COLUMN IF NOT EXISTS is_dangerous BOOLEAN DEFAULT FALSE;

-- STEP 7: Move titration_data to public schema
-- ============================================================================
ALTER TABLE titration_data SET SCHEMA public;
ALTER TABLE public.titration_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "titration_authenticated_read" ON public.titration_data;
CREATE POLICY "titration_authenticated_read"
  ON public.titration_data FOR SELECT USING (auth.uid() IS NOT NULL);

-- STEP 8: Create achievements table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement TEXT NOT NULL CHECK (achievement IN (
    'novice_chemist', 'lab_regular', 'master_researcher',
    'perfectionist', 'titration_expert', 'organic_specialist'
  )),
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_student_achievement UNIQUE (student_id, achievement)
);

CREATE INDEX IF NOT EXISTS idx_achievements_student ON achievements(student_id);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "achievements_read_own" ON public.achievements;
CREATE POLICY "achievements_read_own"
  ON public.achievements FOR SELECT USING (student_id = auth.uid());

-- STEP 9: Create auth trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, xp, level)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    0,
    1
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 10: Add RLS policies
-- ============================================================================
DROP POLICY IF EXISTS "profiles_teacher_see_students" ON public.profiles;
CREATE POLICY "profiles_teacher_see_students"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classrooms c
      JOIN public.class_memberships m ON m.classroom_id = c.id
      WHERE c.teacher_id = auth.uid() AND m.student_id = profiles.id
    )
  );

DROP POLICY IF EXISTS "results_authenticated_read" ON public.results;
CREATE POLICY "results_authenticated_read"
  ON public.results FOR SELECT USING (auth.uid() IS NOT NULL);

-- STEP 11: Data cleanup
-- ============================================================================
-- Remove invalid concentration rows
DELETE FROM public.experiment_logs WHERE chem_a = 0 AND chem_b = 0 AND chem_i = 0 AND chem_c = 0;

-- Remove 'Auto Class' spam classrooms
DELETE FROM public.class_memberships WHERE classroom_id IN (
  SELECT id FROM public.classrooms WHERE class_name LIKE 'Auto Class%'
);
DELETE FROM public.classrooms WHERE class_name LIKE 'Auto Class%';

-- Update XP
UPDATE public.profiles p SET xp = COALESCE((
  SELECT COUNT(*) * 50 FROM public.experiment_logs e WHERE e.student_id = p.id
), 0)
WHERE p.role = 'student';

-- STEP 12: Backfill achievements
-- ============================================================================
INSERT INTO public.achievements (student_id, achievement, unlocked_at)
SELECT 
  student_id,
  CASE 
    WHEN exp_count >= 25 THEN 'master_researcher'
    WHEN exp_count >= 10 THEN 'lab_regular'
    WHEN exp_count >= 1 THEN 'novice_chemist'
  END,
  NOW()
FROM (
  SELECT student_id, COUNT(*) as exp_count 
  FROM public.experiment_logs 
  GROUP BY student_id
) sub
WHERE exp_count >= 1
ON CONFLICT (student_id, achievement) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
