## 2026-03-11 - Test coverage improvements
**Gap:** Login component failing tests.
**Learning:** `vi.mock()` factory function variables must be scoped properly when referenced inside `jest.mock()` factory function, using `mockSignInWithPassword` prefix.
**Pattern:** Wrapping the external mock variables in inline closures `signInWithPassword: (...args) => mockSignInWithPassword(...args)`.

## 2026-03-11 - Test coverage improvements
**Gap:** Dashboard component tests.
**Learning:** React Router `<Link>` navigation testing should assert the `href` attribute directly on the rendered `<a>` element rather than simulating clicks and asserting on a mocked `useNavigate` function.
**Pattern:** `expect(labCard).toHaveAttribute('href', '/lab');`

## 2026-03-11 - Test runner configuration
**Gap:** Playwright tests running accidentally by Vitest.
**Learning:** To prevent Vitest from accidentally executing Playwright end-to-end tests and throwing 'Playwright Test did not expect test.describe() to be called here' errors, explicitly add the Playwright test directory to the `exclude` array.
**Pattern:** `exclude: ['tests/**']` in `client/vitest.config.js`
