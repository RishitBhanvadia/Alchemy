---
title: Phase 2 - Organic & Inorganic Persistence
gap_closure: false
target_files:
  - Alchemistry-master/client/src/pages/organic.jsx
  - Alchemistry-master/client/src/pages/inorganic.jsx
---

# Plan: Organic & Inorganic Persistence

## Problem
Results from Organic and Inorganic analysis experiments are not saved to the `experiment_results` table, leaving gaps in user history.

## Strategy
1. **Frontend Update**:
   - Import `supabase` client in `organic.jsx` and `inorganic.jsx`.
   - On successful identification (when `navigate("/success")` is called), insert a record into `experiment_results`.
   - Capture `user_id` and calculate a score (pass/fail = 100/0).

## Steps
1. Modify `organic.jsx`: Add Supabase insert logic in `checkAns()`.
2. Modify `inorganic.jsx`: Add Supabase insert logic in `checkAns()`.
3. Ensure `details` JSON column stores the specific compound identified.
