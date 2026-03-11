---
title: Fix History Tracking - Save to Supabase
gap_closure: true
target_files:
  - Alchemistry-master/client/src/pages/result.jsx
---

# Plan: Fix History Tracking

## Problem
Experiments are not saved to the Supabase `experiment_results` table, so the history page remains empty.

## Strategy
1. Import `supabase` client in `result.jsx`.
2. Add a `useEffect` or update the existing fetch `then` block to insert the experiment result into the `experiment_results` table.
3. Ensure `user_id` is captured from the current session.

## Steps
1. Modify `Alchemistry-master/client/src/pages/result.jsx`.
2. Import `supabase` from `../supabaseClient`.
3. Inside the successful fetch block (where `setData` is called), add logic to insert into Supabase.
