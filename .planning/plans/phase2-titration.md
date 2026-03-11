---
title: Phase 2 - Titration Module Refinement
gap_closure: false
target_files:
  - Alchemistry-master/client/src/pages/titration.jsx
  - Alchemistry-master/server/migrations/20260225_create_titration_table.sql
---

# Plan: Refine Titration Module

## Problem
Titration data is currently hardcoded in `titration.jsx`, limiting flexibility and scalability. Physics simulation is basic.

## Strategy
1. **Database Migration**: Create a `titration_data` table in Supabase to store reaction pairs (Acid/Base/Indicator) and their color/pH curves.
2. **Backend**: Create an endpoint to fetch titration data.
3. **Frontend**:
   - Refactor `titration.jsx` to fetch reaction data dynamically.
   - Implement smoother liquid dropping logic (interpolated animation).
   - Use gradient-based color mixing instead of discrete steps.

## Steps
1. Create `server/migrations/20260225_create_titration_table.sql`.
2. Add sample data for Strong Acid/Strong Base (HCl + NaOH) and Weak Acid/Strong Base (CH3COOH + NaOH).
3. Create a server route/controller to serve this data.
4. Update `titration.jsx` to use the API.
