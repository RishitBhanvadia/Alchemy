-- seed.sql
-- Phase 3.2.1: Demo data for local development
-- Inserts: 1 demo teacher, 1 demo classroom, 2 demo students
--
-- NOTE: This seed file assumes you're using Supabase local dev (supabase start).
-- The UUIDs are hardcoded for deterministic local testing.
-- In production, users are created through Supabase Auth signup.

-- ============================================================
-- Demo Users (inserted into auth.users via Supabase Auth API in local dev)
-- These are placeholder UUIDs for reference; actual insertion may
-- need to be done via the Supabase Auth admin API or Dashboard.
-- ============================================================

-- Demo Teacher profile
INSERT INTO public.profiles (id, role, display_name)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'teacher',
    'Dr. Marie Curie'
)
ON CONFLICT (id) DO UPDATE SET role = 'teacher', display_name = 'Dr. Marie Curie';

-- Demo Student 1 profile
INSERT INTO public.profiles (id, role, display_name)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'student',
    'Alice Student'
)
ON CONFLICT (id) DO UPDATE SET role = 'student', display_name = 'Alice Student';

-- Demo Student 2 profile
INSERT INTO public.profiles (id, role, display_name)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    'student',
    'Bob Student'
)
ON CONFLICT (id) DO UPDATE SET role = 'student', display_name = 'Bob Student';

-- ============================================================
-- Demo Classroom
-- ============================================================
INSERT INTO public.classrooms (id, teacher_id, class_name, class_code)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Chemistry 101 — Intro to Reactions',
    'CHEM101A'
)
ON CONFLICT (id) DO UPDATE SET
    class_name = 'Chemistry 101 — Intro to Reactions',
    class_code = 'CHEM101A';

-- ============================================================
-- Enroll demo students in the classroom
-- ============================================================
INSERT INTO public.class_memberships (classroom_id, student_id)
VALUES
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'),
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003')
ON CONFLICT (classroom_id, student_id) DO NOTHING;

-- ============================================================
-- Demo Assignments (added by Task [5] / 004_assignments.sql)
-- ============================================================

-- Assignment 1: Titration experiment (due in future)
INSERT INTO public.assignments (id, classroom_id, experiment_type, title, description, required_score, due_date)
VALUES (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'titration',
    'Acid-Base Titration Lab',
    'Complete the titration experiment using HCl and NaOH. Achieve at least 70% accuracy.',
    70,
    (now() + interval '30 days')
)
ON CONFLICT (id) DO UPDATE SET
    experiment_type = 'titration',
    title = 'Acid-Base Titration Lab';

-- Assignment 2: Inorganic reactions (already overdue for testing)
INSERT INTO public.assignments (id, classroom_id, experiment_type, title, description, required_score, due_date)
VALUES (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'inorganic',
    'Metal Reactivity Series',
    'Test different metals with acids and rank them by reactivity.',
    60,
    (now() - interval '5 days')
)
ON CONFLICT (id) DO UPDATE SET
    experiment_type = 'inorganic',
    title = 'Metal Reactivity Series';

-- ============================================================
-- Demo Student Assignment Progress
-- ============================================================

-- Alice completed assignment 1 with a good score
INSERT INTO public.student_assignments (assignment_id, student_id, score, completed_at)
VALUES (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    85,
    now() - interval '2 days'
)
ON CONFLICT (assignment_id, student_id) DO UPDATE SET score = 85;

-- Bob has not completed assignment 1 (still pending)
-- Bob has not completed assignment 2 (overdue)
-- (No rows inserted — absence represents pending/overdue status)
