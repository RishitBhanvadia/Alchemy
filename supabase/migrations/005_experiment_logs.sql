-- 005_experiment_logs.sql
-- Phase 3.2.x: Create experiment_logs table for tracking reactions
-- Creates table for logging chemistry experiments

-- Create experiment_logs table
CREATE TABLE IF NOT EXISTS public.experiment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
    chem_a INTEGER NOT NULL DEFAULT 0,
    chem_b INTEGER NOT NULL DEFAULT 0,
    chem_i INTEGER NOT NULL DEFAULT 0,
    chem_c INTEGER NOT NULL DEFAULT 0,
    reaction_id INTEGER,
    outcome_label TEXT,
    score INTEGER,
    ran_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on experiment_logs
ALTER TABLE public.experiment_logs ENABLE ROW LEVEL SECURITY;

-- experiment_logs: users can insert their own experiment logs
CREATE POLICY "Users can insert own experiment logs"
    ON public.experiment_logs
    FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- experiment_logs: users can view their own experiment logs
CREATE POLICY "Users can view own experiment logs"
    ON public.experiment_logs
    FOR SELECT
    USING (auth.uid() = student_id);

-- experiment_logs: teachers can view logs from their classrooms
CREATE POLICY "Teachers can view classroom experiment logs"
    ON public.experiment_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = experiment_logs.classroom_id
            AND c.teacher_id = auth.uid()
        )
    );

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_experiment_logs_student_id ON public.experiment_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_experiment_logs_classroom_id ON public.experiment_logs(classroom_id);
CREATE INDEX IF NOT EXISTS idx_experiment_logs_ran_at ON public.experiment_logs(ran_at DESC);

-- Add locked_chemicals column to classrooms table (JSON array)
ALTER TABLE public.classrooms 
ADD COLUMN IF NOT EXISTS locked_chemicals JSONB DEFAULT '[]'::jsonb;

-- Add last_active_at column to class_memberships table
ALTER TABLE public.class_memberships 
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;
