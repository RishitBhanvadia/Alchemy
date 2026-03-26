const supabase = require('./supabaseClient');

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

const migrationSQL = `
-- STEP 1: Add missing columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1);

UPDATE public.profiles SET full_name = display_name WHERE full_name IS NULL OR full_name = '';
ALTER TABLE public.profiles ALTER COLUMN full_name SET NOT NULL;

-- STEP 2: Rename class_name to name in classrooms
ALTER TABLE public.classrooms RENAME COLUMN class_name TO name;

ALTER TABLE public.classrooms 
ADD CONSTRAINT name_not_empty CHECK (length(trim(name)) BETWEEN 1 AND 100),
ADD CONSTRAINT join_code_format CHECK (join_code ~ '^[A-Z0-9]{5,8}$');

-- STEP 3: Enhance experiment_logs
ALTER TABLE public.experiment_logs
ADD CONSTRAINT concentrations_sum_100 CHECK (chem_a + chem_b + chem_i + chem_c = 100),
ADD COLUMN IF NOT EXISTS module TEXT DEFAULT 'lab' CHECK (module IN ('lab', 'titration', 'organic', 'inorganic')),
ADD COLUMN IF NOT EXISTS score INTEGER CHECK (score BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS ran_at TIMESTAMPTZ;

-- STEP 4: Rebuild results table
ALTER TABLE public.results
ADD COLUMN IF NOT EXISTS regime TEXT DEFAULT 'NEUTRAL' CHECK (regime IN ('ACID_DOMINANT', 'BASE_DOMINANT', 'NEUTRAL')),
ADD COLUMN IF NOT EXISTS outcome_label TEXT,
ADD COLUMN IF NOT EXISTS product_formula TEXT,
ADD COLUMN IF NOT EXISTS state_change TEXT,
ADD COLUMN IF NOT EXISTS thermal_effect TEXT,
ADD COLUMN IF NOT EXISTS ai_tutor_context TEXT,
ADD COLUMN IF NOT EXISTS is_dangerous BOOLEAN DEFAULT FALSE;

ALTER TABLE public.results DROP COLUMN IF EXISTS conc_a;
ALTER TABLE public.results DROP COLUMN IF EXISTS conc_b;
ALTER TABLE public.results DROP COLUMN IF EXISTS conc_c;
ALTER TABLE public.results DROP COLUMN IF EXISTS conc_d;
ALTER TABLE public.results DROP COLUMN IF EXISTS result_name;
ALTER TABLE public.results DROP COLUMN IF EXISTS result_formula;
ALTER TABLE public.results DROP COLUMN IF EXISTS color;
ALTER TABLE public.results DROP COLUMN IF EXISTS characteristics;

ALTER TABLE public.results ADD CONSTRAINT unique_reaction_regime UNIQUE (reaction_id, regime);

-- STEP 5: Move titration_data to public schema
ALTER TABLE titration_data SET SCHEMA public;
ALTER TABLE public.titration_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "titration_authenticated_read" ON public.titration_data;
CREATE POLICY "titration_authenticated_read"
  ON public.titration_data FOR SELECT USING (auth.uid() IS NOT NULL);

-- STEP 6: Create achievements table
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

-- STEP 7: Create auth trigger
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

-- STEP 8: Add RLS policies
DROP POLICY IF EXISTS "profiles_teacher_see_students" ON public.profiles;
CREATE POLICY "profiles_teacher_see_students"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classrooms c
      JOIN public.classroom_students m ON m.classroom_id = c.id
      WHERE c.teacher_id = auth.uid() AND m.student_id = profiles.id
    )
  );

DROP POLICY IF EXISTS "Allow public read access" ON public.results;
CREATE POLICY "results_authenticated_read"
  ON public.results FOR SELECT USING (auth.uid() IS NOT NULL);

-- STEP 9: Data cleanup
DELETE FROM public.experiment_logs WHERE chem_a = 0 AND chem_b = 0 AND chem_i = 0 AND chem_c = 0;

DELETE FROM public.classroom_students WHERE classroom_id IN (
  SELECT id FROM public.classrooms WHERE name LIKE 'Auto Class%'
);
DELETE FROM public.classrooms WHERE name LIKE 'Auto Class%';

UPDATE public.profiles p SET xp = COALESCE((
  SELECT COUNT(*) * 50 FROM public.experiment_logs e WHERE e.student_id = p.id
), 0)
WHERE p.role = 'student';

-- STEP 10: Backfill achievements
INSERT INTO public.achievements (student_id, achievement, unlocked_at)
SELECT 
  student_id,
  CASE 
    WHEN exp_count >= 1 THEN 'novice_chemist'
    WHEN exp_count >= 10 THEN 'lab_regular'
    WHEN exp_count >= 25 THEN 'master_researcher'
  END,
  NOW()
FROM (
  SELECT student_id, COUNT(*) as exp_count 
  FROM public.experiment_logs 
  GROUP BY student_id
) sub
WHERE exp_count >= 1
ON CONFLICT (student_id, achievement) DO NOTHING;
`;

async function runMigration() {
  console.log('Starting database migration...');
  
  try {
    // Use rpc to execute raw SQL (requires pgjwt extension)
    // Since we can't execute raw SQL directly via JS client, we'll need a different approach
    
    // Let's try using the console API endpoint instead
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'params=run'
      },
      body: JSON.stringify({ query: migrationSQL })
    });
    
    console.log('Response status:', response.status);
    
    // Try alternative - just check connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Connection error:', error);
    } else {
      console.log('Connected successfully!');
      console.log('Note: Direct SQL execution requires Supabase CLI or SQL Editor.');
      console.log('Please run the migration file: supabase/migrations/006_schema_audit_fix.sql');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runMigration();
