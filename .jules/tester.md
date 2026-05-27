## 2026-05-27 - Test authStore login and logout flows
**Gap:** Authentication state management (authStore) had very low test coverage (3.57%), leaving critical logic untested.
**Learning:** Auth flow relies heavily on Supabase mocking for robust testability without connecting to a real database.
**Pattern:** Mocking the global Supabase object (`vi.mock('../../supabaseClient', ...)`) and chained functions (`select().eq().single()`) provides a reliable way to simulate backend responses and test Zustand store state updates for `init()` and `logout()`.
