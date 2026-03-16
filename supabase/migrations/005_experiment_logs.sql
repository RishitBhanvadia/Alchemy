-- 005_experiment_logs.sql
-- Phase 3.2.x: Create experiment_logs table for tracking reactions
-- Creates table for logging chemistry experiments

-- Create experiment_logs table
CREATE TABLE IF NOT EXISTS public.experiment_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
    chem_a INTEGER NOT NULL DEFAULT 0,
    chem_b INTEGER NOT NULL DEFAULT 0,
    chem_i INTEGER NOT NULL DEFAULT 0,
    chem_c INTEGER NOT NULL DEFAULT 0,
    reaction_id INTEGER,
    outcome_label TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
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
CREATE INDEX IF NOT EXISTS idx_experiment_logs_created_at ON public.experiment_logs(created_at DESC);

-- Add locked_chemicals column to classrooms table (JSON array)
ALTER TABLE public.classrooms 
ADD COLUMN IF NOT EXISTS locked_chemicals JSONB DEFAULT '[]'::jsonb;

-- Add last_active_at column to classroom_students table
ALTER TABLE public.classroom_students 
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;

-- Add experiment_type column to experiment_logs if needed for analytics
ALTER TABLE public.experiment_logs
ADD COLUMN IF NOT EXISTS experiment_type TEXT DEFAULT 'inorganic';

-- Add ran_at as an alias for created_at compatibility (views workaround)
-- Since we can't add a computed column easily, we'll use created_at everywhere
-- and update the client code to use created_at instead of ran_at
