# Command Journal

## 2024-03-04 — Vitest Executing Playwright Specs
**Pattern:** Playwright tests are being placed inside `tests/` directory but `vitest.config.js` does not explicitly exclude this folder, leading to test runner crashes since Vitest attempts to evaluate `test.describe()`.
**Detection:** `npm run test` fails with "Playwright Test did not expect test.describe() to be called here."
**Prevention:** Command should enforce that new configurations properly declare test boundaries (`include` vs `exclude`) before any test dependencies are executed or introduced.

## 2024-03-04 — Vitest Hoisting Mock References
**Pattern:** Tests attempting to mock variables initialized in the test file scope via `const x = vi.fn()` will fail during `vi.mock` due to hoisting scope.
**Detection:** Build fails with `ReferenceError: Cannot access '...' before initialization`.
**Prevention:** Command must always suggest initializing mocked objects (like `vi.fn()`) explicitly inside the `vi.mock()` factory pattern.
