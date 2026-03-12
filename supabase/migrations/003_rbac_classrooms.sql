-- 003_rbac_classrooms.sql
-- Phase 3.2.1: Role-Based Access Control for Classrooms
-- Creates user roles, classrooms table, and classroom_students junction table
--
-- Dependencies: Supabase auth.users table must exist
-- Applied: Phase 3 Task [4]

-- ============================================================
-- 1. Add role column to user profiles
-- ============================================================
-- NOTE: We cannot directly ALTER auth.users in Supabase hosted.
-- Instead, we create a public.profiles table with role information.
-- If a profiles table already exists, we add the role column to it.

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    display_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Profiles: users can update their own profile (but not role)
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Profiles: admins can view all profiles
CREATE POLICY "Admins can view all profiles"
    ON public.profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Auto-create profile on user signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. Classrooms table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    class_name TEXT NOT NULL,
    join_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on classrooms
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

-- Classrooms: teachers can CRUD their own classrooms
CREATE POLICY "Teachers can manage own classrooms"
    ON public.classrooms
    FOR ALL
    USING (auth.uid() = teacher_id)
    WITH CHECK (auth.uid() = teacher_id);

-- Classrooms: students can see classrooms they are members of (read-only)
CREATE POLICY "Students can view joined classrooms"
    ON public.classrooms
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.classroom_students cs
            WHERE cs.classroom_id = id
            AND cs.student_id = auth.uid()
        )
    );

-- ============================================================
-- 3. Classroom Students junction table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.classroom_students (
    classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (classroom_id, student_id)
);

-- Enable RLS on classroom_students
ALTER TABLE public.classroom_students ENABLE ROW LEVEL SECURITY;

-- classroom_students: teachers can SELECT students in their own classrooms
CREATE POLICY "Teachers can view their classroom students"
    ON public.classroom_students
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.classrooms c
            WHERE c.id = classroom_id
            AND c.teacher_id = auth.uid()
        )
    );

-- classroom_students: students can INSERT themselves only (join a classroom)
CREATE POLICY "Students can join classrooms"
    ON public.classroom_students
    FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- classroom_students: students can view their own memberships
CREATE POLICY "Students can view own memberships"
    ON public.classroom_students
    FOR SELECT
    USING (auth.uid() = student_id);

-- classroom_students: students can leave classrooms (delete own membership)
CREATE POLICY "Students can leave classrooms"
    ON public.classroom_students
    FOR DELETE
    USING (auth.uid() = student_id);

-- ============================================================
-- 4. Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_classrooms_teacher_id ON public.classrooms(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classroom_students_student_id ON public.classroom_students(student_id);
CREATE INDEX IF NOT EXISTS idx_classroom_students_classroom_id ON public.classroom_students(classroom_id);
CREATE INDEX IF NOT EXISTS idx_classrooms_join_code ON public.classrooms(join_code);
