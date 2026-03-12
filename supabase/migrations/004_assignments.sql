-- 004_assignments.sql
-- Phase 3.2.3: Custom Lab Assignments Engine
-- Creates assignments and student_assignments tables with RLS policies
--
-- Dependencies: 003_rbac_classrooms.sql must be applied first
-- Applied: Phase 3 Task [5]

-- ============================================================
-- 1. Assignments table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    experiment_type TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    description TEXT DEFAULT '',
    required_score INTEGER NOT NULL DEFAULT 70 CHECK (required_score >= 0 AND required_score <= 100),
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Assignments: teachers can CRUD assignments for their own classrooms
CREATE POLICY "Teachers can manage assignments in own classrooms"
    ON public.assignments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = classroom_id
            AND c.teacher_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = classroom_id
            AND c.teacher_id = auth.uid()
        )
    );

-- Assignments: students can view assignments for classrooms they belong to
CREATE POLICY "Students can view assignments for their classrooms"
    ON public.assignments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.classroom_students cs
            WHERE cs.classroom_id = assignments.classroom_id
            AND cs.student_id = auth.uid()
        )
    );

-- ============================================================
-- 2. Student Assignments (junction / progress tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.student_assignments (
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (assignment_id, student_id)
);

-- Enable RLS on student_assignments
ALTER TABLE public.student_assignments ENABLE ROW LEVEL SECURITY;

-- Student Assignments: teachers can view student progress for their classroom assignments
CREATE POLICY "Teachers can view student assignment progress"
    ON public.student_assignments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.assignments a
            JOIN public.classrooms c ON c.id = a.classroom_id
            WHERE a.id = assignment_id
            AND c.teacher_id = auth.uid()
        )
    );

-- Student Assignments: students can view their own assignment progress
CREATE POLICY "Students can view own assignment progress"
    ON public.student_assignments
    FOR SELECT
    USING (auth.uid() = student_id);

-- Student Assignments: students can submit/update their own scores
CREATE POLICY "Students can submit own assignment results"
    ON public.student_assignments
    FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own assignment results"
    ON public.student_assignments
    FOR UPDATE
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id);

-- ============================================================
-- 3. Helper view: student assignment status with computed status
-- ============================================================
CREATE OR REPLACE VIEW public.student_assignment_status AS
SELECT
    sa.assignment_id,
    sa.student_id,
    a.experiment_type,
    a.title,
    a.required_score,
    a.due_date,
    a.classroom_id,
    sa.score,
    sa.completed_at,
    CASE
        WHEN sa.completed_at IS NOT NULL AND sa.score >= a.required_score THEN 'Completed'
        WHEN a.due_date IS NOT NULL AND a.due_date < now() AND (sa.completed_at IS NULL OR sa.score < a.required_score) THEN 'Overdue'
        ELSE 'Pending'
    END AS status
FROM public.assignments a
LEFT JOIN public.student_assignments sa ON sa.assignment_id = a.id;

-- ============================================================
-- 4. Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_assignments_classroom_id ON public.assignments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_assignments_due_date ON public.assignments(due_date);
CREATE INDEX IF NOT EXISTS idx_student_assignments_student_id ON public.student_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_assignments_assignment_id ON public.student_assignments(assignment_id);
