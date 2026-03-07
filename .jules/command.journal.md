# Command Journal

## 2024-03-07 - Test Framework Conflicts
**Pattern:** Playwright tests (`.spec.js`) and Vitest tests (`.test.jsx`) are mixed in the same frontend repository without proper path exclusions in `vitest.config.js`. Concurrently, Jest is installed in the `server/` directory without a configuration file limiting its root, causing it to traverse into `client/` and attempt to parse ES Modules incorrectly.
**Detection:** Vitest fails when parsing `test.describe()` in `.spec.js`. Jest fails with `SyntaxError: Cannot use import statement outside a module` when parsing `.test.js` files in `client/`.
**Prevention:** Always enforce strict path boundaries when multiple test frameworks exist in a monorepo or adjacent directories. `vitest.config.js` MUST explicitly exclude end-to-end testing directories. `jest.config.js` MUST explicitly set `roots: ['<rootDir>']` to avoid upward traversal.

## 2024-03-07 - Vitest vi.mock Hoisting
**Pattern:** Agents mock external modules using `vi.mock()` but reference variables defined outside the mock block, causing `ReferenceError: Cannot access '...' before initialization` due to Vitest's automatic hoisting.
**Detection:** Test suite fails immediately with `ReferenceError` during file parsing/setup.
**Prevention:** When mocking methods inside `vi.mock()`, wrap the mock calls in inline closures (e.g., `method: (...args) => mockMethod(...args)`) to defer evaluation until execution time.

## 2024-03-07 - UI Text Changes Breaking Tests
**Pattern:** Agents or humans update UI text (e.g., changing generic "Dashboard" to "WELCOME, ADMIN") without updating the corresponding test assertions (`screen.getByText()`), leading to brittle test failures.
**Detection:** Tests fail with `TestingLibraryElementError: Unable to find an element with the text`.
**Prevention:** When updating user-facing text, always run `npm test` locally. If an agent changes UI text, Command must issue a fix prompt to update the test assertions to match the new text.
