-- ============================================================================
-- VERIFICATION QUERIES - Run after migration
-- ============================================================================

-- 1. Check all tables exist with columns
SELECT table_name, COUNT(*) as columns
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY table_name
ORDER BY table_name;

-- 2. Verify RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 3. Check constraints
SELECT tc.table_name, tc.constraint_name, cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON cc.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public' AND tc.constraint_type = 'CHECK'
ORDER BY tc.table_name;

-- 4. Check row counts
SELECT 
  (SELECT COUNT(*) FROM profiles) as profiles,
  (SELECT COUNT(*) FROM classrooms) as classrooms,
  (SELECT COUNT(*) FROM experiment_logs) as experiment_logs,
  (SELECT COUNT(*) FROM achievements) as achievements,
  (SELECT COUNT(*) FROM results) as results,
  (SELECT COUNT(*) FROM titration_data) as titration_data;

-- 5. Verify auth trigger exists
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- 6. Check for orphaned data
SELECT 
  (SELECT COUNT(*) FROM experiment_logs WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = student_id)) as orphaned_logs,
  (SELECT COUNT(*) FROM class_memberships WHERE NOT EXISTS (SELECT 1 FROM classrooms WHERE id = classroom_id)) as orphaned_memberships;

-- 7. Check concentration integrity
SELECT COUNT(*) as invalid_concentrations
FROM experiment_logs
WHERE chem_a + chem_b + chem_i + chem_c != 100;

-- 8. Verify RLS policies
SELECT policyname, tablename, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;

-- 9. Check profiles have full_name
SELECT COUNT(*) as profiles_missing_full_name
FROM profiles
WHERE full_name IS NULL OR full_name = '';

-- 10. Check classroom columns are correct
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'classrooms' AND column_name IN ('class_name', 'class_code');
