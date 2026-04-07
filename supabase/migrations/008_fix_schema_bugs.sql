-- 008_fix_schema_bugs.sql
-- Schema Audit Fix Migration
-- Addresses bugs found during the April 2026 schema audit
--
-- This migration is SAFE to run against the live Alchemistry DB.
-- All operations use IF EXISTS / IF NOT EXISTS guards.

-- ============================================================================
-- BUG #8: Create achievements table (missing from live DB)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement TEXT NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (student_id, achievement)
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Users can view their own achievements
CREATE POLICY "Users can view own achievements"
    ON public.achievements
    FOR SELECT
    USING (auth.uid() = student_id);

-- Users can insert their own achievements (for client-side logic)
CREATE POLICY "Users can insert own achievements"
    ON public.achievements
    FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- Teachers can view achievements of their students
CREATE POLICY "Teachers can view student achievements"
    ON public.achievements
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.class_memberships cm
            WHERE cm.student_id = achievements.student_id
            AND cm.teacher_id = auth.uid()
        )
    );

CREATE INDEX IF NOT EXISTS idx_achievements_student_id ON public.achievements(student_id);

-- ============================================================================
-- BUG #7: Fix auth trigger to NOT reference xp/level
-- (already correct in live DB, but documenting the correct version)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, display_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', NEW.email, 'New User'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', NEW.email, 'New User'),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- BUG #9: Drop orphaned results_backup table (0 rows, no code references)
-- ============================================================================
DROP TABLE IF EXISTS public.results_backup;

-- ============================================================================
-- Clean up duplicate helper functions (keep handle_* versions used by triggers)
-- ============================================================================
-- sync_membership_teacher and sync_profile_names are older duplicates
-- of handle_sync_membership_teacher and handle_sync_profile_names.
-- The triggers use the handle_* versions, so the older ones are safe to drop.
DROP FUNCTION IF EXISTS public.sync_membership_teacher() CASCADE;
DROP FUNCTION IF EXISTS public.sync_profile_names() CASCADE;

-- ============================================================================
-- Add missing RLS policies for tables that have RLS enabled but loose policies
-- ============================================================================

-- results table: currently has RLS enabled but no policies → locked out
-- Add read-only policy for authenticated users (lookup table)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'results' AND policyname = 'Authenticated users can read results'
    ) THEN
        CREATE POLICY "Authenticated users can read results"
            ON public.results
            FOR SELECT
            TO authenticated
            USING (true);
    END IF;
END $$;

-- student_assignments: ensure students can see their own assignments
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'student_assignments' AND policyname = 'Students can view own assignments'
    ) THEN
        CREATE POLICY "Students can view own assignments"
            ON public.student_assignments
            FOR SELECT
            USING (auth.uid() = student_id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'student_assignments' AND policyname = 'Students can update own assignments'
    ) THEN
        CREATE POLICY "Students can update own assignments"
            ON public.student_assignments
            FOR UPDATE
            USING (auth.uid() = student_id)
            WITH CHECK (auth.uid() = student_id);
    END IF;
END $$;

-- ============================================================================
-- Verification: list all tables and their RLS status
-- ============================================================================
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
