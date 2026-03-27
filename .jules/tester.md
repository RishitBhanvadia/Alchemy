## 2024-05-18 - Auth Store Unit Tests Additions

**Gap:** The critical user authentication flow within `useAuthStore` (login init, handling sessions, loading profiles, and logout) lacked dedicated unit tests, despite handling core application states and Supabase integrations. This was a critical missing gap since most of the core logic was driven off of this store.

**Learning:** When unit testing Zustand stores that have dependencies on Supabase `auth` APIs and dynamically imported other Zustand stores (e.g., `useLabStore`), explicitly mock both the top-level external modules and other stores at the top using `vi.mock()`. Doing so avoids runtime errors and circular dependencies inside the test runner since `vi.mock` requests hoist to the top of the test module.

**Pattern:** Apply explicit isolated mocks for dependent Zustand stores and Supabase client:
```javascript
vi.mock('../../supabaseClient', () => ({
  supabase: { auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn() }, from: vi.fn() }
}));
vi.mock('../labStore', () => ({ default: { getState: () => ({ reset: vi.fn() }) } }));
```
Then proceed with normal `beforeEach` mock resets and assertion tests against `useAuthStore.getState()`.