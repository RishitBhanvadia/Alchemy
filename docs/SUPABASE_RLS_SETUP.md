# Supabase Row Level Security (RLS) Setup Guide

## Overview
This guide provides SQL commands to enable Row Level Security on your Supabase tables.

## Prerequisites
- Access to Supabase Dashboard
- Database access with admin privileges

## Implementation Steps

### 1. Enable RLS on Tables

```sql
-- Enable RLS on experiment_results table
ALTER TABLE experiment_results ENABLE ROW LEVEL SECURITY;

-- Enable RLS on results table
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
```

### 2. Create Policies for experiment_results

```sql
-- Policy: Users can only view their own experiment results
CREATE POLICY "Users can view own experiments"
ON experiment_results FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own experiment results
CREATE POLICY "Users can insert own experiments"
ON experiment_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own experiment results
CREATE POLICY "Users can update own experiments"
ON experiment_results FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own experiment results
CREATE POLICY "Users can delete own experiments"
ON experiment_results FOR DELETE
USING (auth.uid() = user_id);
```

### 3. Create Policies for results (Chemistry Data)

```sql
-- Policy: Anyone authenticated can read chemistry results
CREATE POLICY "Authenticated users can read results"
ON results FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy: Only service role can modify results
CREATE POLICY "Service role can modify results"
ON results FOR ALL
USING (auth.role() = 'service_role');
```

## Verification

After applying these policies, verify they work correctly:

1. **Test User Access**: Log in as a regular user and try to:
   - View their own experiments ✅
   - View another user's experiments ❌
   - Insert new experiments ✅

2. **Test Chemistry Data**: Verify that:
   - Authenticated users can read chemistry results ✅
   - Users cannot modify chemistry data ❌

## Rollback (if needed)

```sql
-- Disable RLS
ALTER TABLE experiment_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;

-- Drop policies
DROP POLICY IF EXISTS "Users can view own experiments" ON experiment_results;
DROP POLICY IF EXISTS "Users can insert own experiments" ON experiment_results;
DROP POLICY IF EXISTS "Users can update own experiments" ON experiment_results;
DROP POLICY IF EXISTS "Users can delete own experiments" ON experiment_results;
DROP POLICY IF EXISTS "Authenticated users can read results" ON results;
DROP POLICY IF EXISTS "Service role can modify results" ON results;
```

## Notes

- RLS policies are enforced at the database level
- Service role bypasses RLS (use carefully)
- Test thoroughly before deploying to production
- Monitor Supabase logs for policy violations
