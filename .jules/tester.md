## 2026-05-15 - Testing authStore
**Gap:** The critical user authentication flow in `authStore.js` is completely untested (3% coverage).
**Learning:** `authStore.js` relies heavily on `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange`. We must carefully mock the supabase client and the dynamic module imports during `logout()` to avoid test crashes.
**Pattern:** We can use vitest to create a mock file `client/src/store/__tests__/authStore.test.js`. We will mock the `supabaseClient` and use `beforeEach` to reset the store and mock implementations.
