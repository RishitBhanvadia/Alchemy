## 2024-05-18 - Improve Auth Store Coverage
**Gap:** Critical user authentication flows (login, session initialization, auto-profile creation, logout) in `authStore.js` were largely untested, with only 3.57% statement coverage.
**Learning:** Testing chained Supabase SDK methods (`.from().select().eq().single()`) can be tricky; returning mock functions that return themselves (for chainables) and resolving data appropriately allows isolated unit testing of the store logic without hitting the DB.
**Pattern:** Creating robust tests for Zustand stores involving async side-effects, auth state subscriptions, and dynamically imported store resetting.
