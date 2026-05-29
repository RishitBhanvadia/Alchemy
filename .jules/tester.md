## 2026-05-29 - Testing Zustand Stores with Supabase
**Gap:** Authentication flows in authStore were untested, leaving critical paths like login, logout, and profile loading vulnerable.
**Learning:** Testing Zustand stores that interact with Supabase in Vitest requires mocking the Supabase client and simulating its nested response chaining (e.g., .from().select().eq().single()) to avoid real database interactions. Additionally, cross-store actions like logout require mocking dependent stores (e.g., labStore) to prevent circular dependencies.
**Pattern:** Explicitly mock the Supabase client before the module import, structure the mock to replicate the chainable API, and mock other store modules when testing actions that affect multiple slices of state.
