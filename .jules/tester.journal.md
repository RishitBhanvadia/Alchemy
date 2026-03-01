## 2025-03-01 — Fixing vi.mock Hoisting with External Variables in Vitest
**Finding:** A ReferenceError (`Cannot access 'mockSignInWithPassword' before initialization`) was occurring in Vitest because `vi.mock` was using a module-scoped variable that wasn't properly hoisted.
**Learning:** When using `vi.mock` in Vitest, variables from the outer scope referenced inside the mock factory (like mock functions) must be declared using `vi.hoisted()` to prevent 'Cannot access before initialization' errors during test execution, because `vi.mock` is hoisted to the top of the file before other initializations.
**Prevention:** Always use `vi.hoisted()` for shared mock state variables when defining custom mock factories in Vitest.

## 2025-03-01 — Vitest Playwright Exclusion Configuration
**Finding:** Vitest throws an error `Playwright Test did not expect test.describe() to be called here` when it scans standard `tests/` directories if there are Playwright `.spec.js` files, due to importing Playwright objects.
**Learning:** The default `exclude` paths from Vitest might need explicit overrides to exclude standard E2E test folders.
**Prevention:** Hardcode the full exclusion array including Playwright test directories (e.g., `tests/**`) in `vitest.config.js` to avoid `ERR_REQUIRE_ESM` and Playwright `test.describe` conflicts.
