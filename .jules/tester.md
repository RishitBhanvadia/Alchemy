## 2025-03-01 - Add tests for Auth Store logout flow
**Gap:** The authStore.js `logout` and `init` methods lacked test coverage.
**Learning:** `logout` clears session and user details. Using `jest.mock` / `vi.mock` on Supabase must provide correctly shaped stubs.
**Pattern:** For auth state testing, resetting store mocks with `beforeEach` and triggering logic provides effective store test coverage.
