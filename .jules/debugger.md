## 2024-03-09 - [Test Suite Failures]
**Bug:** The test suite was failing due to multiple issues:
1) Playwright tests were being picked up by Vitest, throwing `test.describe() not expected here`.
2) A `ReferenceError` on `mockSignInWithPassword` in `Login.test.jsx`.
3) Incorrect assertions targeting out-of-date UI strings in `Dashboard.test.jsx` and `Login.test.jsx`.
**Root Cause:**
1) Misconfigured `vitest.config.js` missing the `tests/` directory from the test exclusion list.
2) `vi.mock()` hoisting referencing a variable (`mockSignInWithPassword`) declared outside its scope before initialization.
3) UI copy changes ("dashboard" -> "WELCOME, ADMIN", "login" -> "ACCESS LAB", "email" -> "student@university.edu") were not synchronized with the test assertions.
**Learning:**
1) Playwright end-to-end tests must be explicitly excluded from Vitest via the `exclude` configuration array to prevent runner collision.
2) When using `vi.mock()` in Vitest, variables declared outside the mock block cannot be directly referenced inside it due to hoisting. To fix this, wrap the mock function call in an inline closure, e.g., `signInWithPassword: (...args) => mockSignInWithPassword(...args)`.
3) UI text-based test queries (like `getByText`, `getByPlaceholderText`) must exactly match the rendered component text and need to be kept up-to-date with design copy changes.
