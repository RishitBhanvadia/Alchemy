---
title: Phase 2 - User Profile & Gamification
gap_closure: false
target_files:
  - Alchemistry-master/client/src/pages/Profile.jsx
  - Alchemistry-master/client/src/App.jsx
---

# Plan: User Profile & Gamification

## Problem
Users lack a centralized view of their progress, stats, and achievements.

## Strategy
1. **New Page**: Create `Profile.jsx`.
2. **Data Fetching**:
   - Fetch all `experiment_results` for the user.
   - Calculate "Mastery Level" (XP based on total score).
   - Determine Badges (e.g., "5 Lab Experiments", "Perfect Titration").
3. **Routing**: Add `/profile` route to `App.jsx` and `Navbar.jsx`.

## Steps
1. Create `client/src/pages/Profile.jsx` with Glassmorphism UI.
2. Implement stats calculation logic.
3. Add badges logic.
4. Update `App.jsx` to include the route.
