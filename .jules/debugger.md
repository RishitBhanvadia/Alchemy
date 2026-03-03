## YYYY-MM-DD - Fix Login Component Test Mock Issue
**Bug:** Vitest throws "Cannot access 'mockSignInWithPassword' before initialization" when running Login.test.jsx.
**Root Cause:** The `vi.mock` factory in `client/src/pages/__tests__/Login.test.jsx` is hoisted to the top of the file, but it references `mockSignInWithPassword` which is defined later.
**Learning:** When using `vi.mock` in Vitest, variables from the outer scope referenced inside the mock factory must be declared using `vi.hoisted()` or `vi.fn()` directly inside the mock to prevent 'Cannot access before initialization' errors during JSDOM test execution.
