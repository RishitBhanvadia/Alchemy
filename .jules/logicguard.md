LOGICGUARD'S JOURNAL - CRITICAL LEARNINGS ONLY

## 2024-05-24 - Result Calculation Convergence Failure
**Bug:** The chemical result calculation logic failed to ensure that the sum of concentrations equals exactly 100% when rounding errors accumulate beyond a single 10% step. Inputs like 23, 23, 23, 23 resulted in a sum of 110% because the code only corrected the sum once.
**Root Cause:** The adjustment logic assumed that the deviation from 100 would always be exactly ±10. It did not account for cases where multiple components round up/down, creating a larger deviation (e.g., ±20).
**Learning:** When normalizing data that must sum to a fixed total (like 100%), do not assume the error magnitude is bounded by a single step. Use an iterative convergence loop with a safety break to ensure the invariant holds. Also, adjusting the largest components minimizes relative error compared to adjusting the smallest.

## 2024-05-24 - CI/CD Pipeline Fragility
**Bug:** Vitest was attempting to run Playwright E2E tests in the `tests/` directory, causing `ERR_REQUIRE_ESM` failures due to environment mismatches. Additionally, unit tests for `Login` and `Dashboard` were failing due to outdated selectors and hoisting issues with `vi.mock`.
**Root Cause:** The `vitest.config.js` file did not exclude the `tests/` folder from the test run, only from coverage.
**Learning:** Always explicitly exclude E2E test directories (like `tests/` or `playwright/`) in the `test.exclude` configuration of `vitest.config.js` to prevent accidental execution in the unit test environment. Also, use `vi.hoisted()` when mocking modules that are needed before the mock factory is called.

## 2024-05-24 - CI/CD Pipeline Fragility - Part 2
**Bug:** The CI pipeline failed on a linting error in `client/src/pages/__tests__/Dashboard.test.jsx` because `fireEvent` was imported but unused after refactoring the test to rely on default accessibility behaviors.
**Root Cause:** ESLint rule `no-unused-vars` was triggered.
**Learning:** When refactoring tests to be more accessible (e.g., checking focus state instead of firing events), always clean up unused imports immediately. Local linting (`npm run lint`) should be part of the verification process before pushing.

## 2024-05-24 - Dependency Compatibility in Node 18
**Bug:** CI pipeline failed with `ERR_REQUIRE_ESM` inside `jsdom` (v28) dependencies.
**Root Cause:** The project was using `jsdom@28.0.0` and `vitest@4.0.18`, which require Node 20+, but the CI environment runs Node 18.20.8. This caused `jsdom` to pull in ESM-only dependencies that failed in the CJS/ESM interop context of Node 18.
**Learning:** When working in a fixed CI environment (e.g., Node 18), always pin dependencies to compatible versions. Downgrading `jsdom` to `^25.0.1` and `vitest` to `^2.1.8` resolved the issue. Always check `package.json` engines field or release notes when encountering opaque ESM errors in older Node versions.
