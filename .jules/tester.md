## 2024-05-18 - Auth Flow Tests
**Gap:** Authentication flows via Supabase integration inside Zustand (`authStore.js`)
**Learning:** Zustand stores that fetch user profiles via external integrations can be tricky to test. Proper mocking of supabase client is required. We must mock the store integration and state transitions robustly.
**Pattern:** Mock supabase client `supabase.auth.getSession()` and `supabase.from()`. Use `vi.mock` for `../supabaseClient` and assert the states update accordingly.
