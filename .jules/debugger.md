## 2024-05-24 - Vitest/Playwright Conflict & Mock Hoisting
**Bug:** Test suite failures due to Vitest picking up Playwright tests and ReferenceError in mocks.
**Root Cause:** Vitest default config includes all files in 'tests/', and vi.mock hoisting causes variables defined after hoisting to be undefined in the factory.
**Learning:** Explicitly exclude 'tests/' in vitest.config.js if Playwright is used. Use vi.hoisted() to define variables used in vi.mock() factories.
