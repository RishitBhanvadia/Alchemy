## 2024-06-09 - Added missing auth flow tests

**Gap:** `authStore.js` critical authentication logic and profile fetching had almost zero test coverage.
**Learning:** This is a crucial state component for login sessions, so ensuring robust error states and profile fallback creation flow handling are appropriately covered is vital.
**Pattern:** Created tests using `vitest` mocking the Supabase client nested properties (like `supabase.auth.getSession` and `supabase.from().select().eq().single()`) effectively tracking its side-effects on the Zustand store in isolated test runs.
