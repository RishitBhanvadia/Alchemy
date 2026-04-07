-- rls_policies.sql
-- Phase 3.2.1: Row Level Security policies reference document
-- These policies are applied within 003_rbac_classrooms.sql migration
-- This file serves as a standalone reference and for re-application
--
-- ============================================================
-- PROFILES TABLE POLICIES
-- ============================================================

-- Users can view their own profile
-- CREATE POLICY "Users can view own profile"
--     ON public.profiles FOR SELECT
--     USING (auth.uid() = id);

-- Users can update their own profile (but not role)
-- CREATE POLICY "Users can update own profile"
--     ON public.profiles FOR UPDATE
--     USING (auth.uid() = id)
--     WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
-- CREATE POLICY "Admins can view all profiles"
--     ON public.profiles FOR SELECT
--     USING (
--         EXISTS (
--             SELECT 1 FROM public.profiles
--             WHERE id = auth.uid() AND role = 'admin'
--         )
--     );

-- ============================================================
-- CLASSROOMS TABLE POLICIES
-- ============================================================

-- Teachers can CRUD their own classrooms
-- Policy: "Teachers can manage own classrooms"
--   FOR ALL
--   USING (auth.uid() = teacher_id)
--   WITH CHECK (auth.uid() = teacher_id)

-- Students can only SELECT classrooms they are members of (read-only)
-- Policy: "Students can view joined classrooms"
--   FOR SELECT
--   USING (
--       EXISTS (
--           SELECT 1 FROM public.class_memberships cm
--           WHERE cs.classroom_id = classrooms.id
--           AND cs.student_id = auth.uid()
--       )
--   )

-- ============================================================
-- CLASSROOM_STUDENTS TABLE POLICIES
-- ============================================================

-- Teachers can SELECT students in classrooms they own
-- Policy: "Teachers can view their classroom students"
--   FOR SELECT
--   USING (
--       EXISTS (
--           SELECT 1 FROM public.classrooms c
--           WHERE c.id = class_memberships.classroom_id
--           AND c.teacher_id = auth.uid()
--       )
--   )

-- Students can only INSERT themselves (their own auth.uid())
-- Policy: "Students can join classrooms"
--   FOR INSERT
--   WITH CHECK (auth.uid() = student_id)

-- Students can view their own memberships
-- Policy: "Students can view own memberships"
--   FOR SELECT
--   USING (auth.uid() = student_id)

-- Students can leave classrooms (delete own membership)
-- Policy: "Students can leave classrooms"
--   FOR DELETE
--   USING (auth.uid() = student_id)

-- ============================================================
-- ASSIGNMENTS TABLE POLICIES (added by 004_assignments.sql)
-- ============================================================
-- See 004_assignments.sql for assignment-related RLS policies
