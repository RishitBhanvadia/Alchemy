
## 2024-05-15 - Auth State Testing Pattern
**Gap:** The critical authentication flow managed by `authStore.js` lacked unit tests, specifically for handling active sessions, missing profiles (`PGRST116`), and logout logic.
**Learning:** Zustand stores that fetch deeply nested dependencies (like Supabase user profiles) on init can be completely mocked to verify they handle various backend states (no profile, created profile). Returning exact errors from mocked Supabase chains is required to test error boundaries effectively.
**Pattern:** Mock the Supabase client entirely using `vi.mock()`, replacing chained DB calls (`.select().eq().single()`) with chainable `vi.fn()`s that resolve to test scenarios like `{ data: null, error: { code: 'PGRST116' } }`. Then assert state variables on the store (`expect(useAuthStore.getState().user).toEqual(...)`).
