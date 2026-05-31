## 2024-05-18 - Lazy load Recharts for dashboard
**Learning:** Recharts is a very heavy dependency that can severely impact the initial bundle size and page load time when included statically.
**Action:** Always lazy load chart libraries like Recharts using `React.lazy` and `Suspense` when they are used below the fold or not strictly required for the immediate initial render. Make sure `Suspense` fallbacks gracefully use existing loaders or properly defined styles.

## 2024-05-18 - SyntaxError duplicate declaration
**Learning:** Destructuring assignment or multiple declarations of the same variable name using `let` or `const` in the same scope will cause a SyntaxError (Parsing error: Identifier has already been declared).
**Action:** When refactoring or making modifications using merge_diff, double-check for duplicate state declarations in React components.

## 2024-05-18 - Unused imports in React
**Learning:** Having an imported but unused module or hook (like `useCallback`) violates ESLint rules and fails strict CI builds.
**Action:** Always clean up unused imports from components, particularly from `react`, after completing refactoring or when you notice ESLint errors complaining about defined but never used variables.

## 2024-05-18 - Rules of Hooks
**Learning:** `useEffect` and other React hooks must be called at the top level of a component. Conditionally returning early (e.g. `if (isTouchDevice) return null;`) before a hook call violates the Rules of Hooks and causes ESLint errors (`react-hooks/rules-of-hooks`).
**Action:** Ensure all early returns in functional components are placed *after* all hook calls.

## 2024-05-18 - Server tests hanging
**Learning:** Calling `app.listen()` directly inside an Express server file that is also imported for testing (e.g. using `supertest`) causes the process to hang indefinitely and fail tests.
**Action:** Always wrap `app.listen()` inside an `if (require.main === module)` block and make sure to export the `app` instance using `module.exports = app;`.
