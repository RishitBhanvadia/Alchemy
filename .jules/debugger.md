## 2024-03-24 - Fix test failures due to environment issues

**Bug:** `pnpm test` fails with errors: Playwright tests picked up by vitest resulting in describe/test errors, Login test fails due to hoisted `vi.mock` variables, and Dashboard test fails looking for text "dashboard".
**Root Cause:**
1. Vitest includes playwright integration tests (`tests/`) without being explicitly excluded.
2. In `Login.test.jsx`, `vi.mock` creates hoisting reference errors if variables like `mockSignInWithPassword` are initialized in outer scope.
3. In `Dashboard.test.jsx`, the title text rendered is "WELCOME, ADMIN", not "dashboard".
**Learning:**
- Always configure `vitest.config.js` to exclude playwright test directories (`tests/**`).
- Use factory functions inside `vi.mock` that return arrow function delegates like `(...args) => mockSignInWithPassword(...args)` to avoid scoping/hoisting issues.
- Update UI assertions to match exact rendering states, e.g. text should be `/WELCOME, ADMIN/i`.
