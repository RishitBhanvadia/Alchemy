## 2024-05-18 - Lazy load Recharts for dashboard
**Learning:** Recharts is a very heavy dependency that can severely impact the initial bundle size and page load time when included statically.
**Action:** Always lazy load chart libraries like Recharts using `React.lazy` and `Suspense` when they are used below the fold or not strictly required for the immediate initial render. Make sure `Suspense` fallbacks gracefully use existing loaders or properly defined styles.

## 2024-05-18 - SyntaxError duplicate declaration
**Learning:** Destructuring assignment or multiple declarations of the same variable name using `let` or `const` in the same scope will cause a SyntaxError (Parsing error: Identifier has already been declared).
**Action:** When refactoring or making modifications using merge_diff, double-check for duplicate state declarations in React components.
