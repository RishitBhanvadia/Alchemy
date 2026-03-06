## 2024-05-24 - Fix Vitest and Playwright Collision & Hoisted Mocks
**Bug:** Vitest test suite was failing due to running Playwright tests and throwing `ReferenceError: Cannot access 'mockSignInWithPassword' before initialization` in Vitest mocks.
**Root Cause:** 1. `vitest.config.js` did not exclude the `tests/` directory where Playwright E2E tests live, causing Vitest to attempt running them. 2. `vi.mock` is hoisted to the top of the file by Vitest, so referencing a variable defined with `const` before the mock results in a ReferenceError.
**Learning:** Always explicitly exclude Playwright test directories from Vitest configuration to avoid runner collisions. When mocking modules in Vitest that reference externally defined mock functions, wrap the mock function call in an inline arrow function (e.g., `(...args) => mockFunction(...args)`) to avoid ReferenceErrors caused by hoisting.
## 2024-05-24 - Fix Vitest jsdom Compatibility on Node 18.x
**Bug:** CI checks fail on `client/package.json` with `ERR_REQUIRE_ESM` and test pool crash.
**Root Cause:** `jsdom` version 28.0.0+ drops support for Node 18.x and requires ESM, but the GitHub Actions CI environment runs on Node 18.x.
**Learning:** To maintain GitHub Actions CI compatibility (which runs on Node 18.x) without unilaterally upgrading Node versions, `jsdom` must be kept at `^22.1.0` in `client/package.json`.
