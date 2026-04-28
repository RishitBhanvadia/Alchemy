## 2025-04-28 - Vite CSS Import Ordering and React State Duplication
**Bottleneck:**
1. Build warnings (`@import rules must precede all rules`) during Vite production build of `index.css`.
2. Esbuild failure (`Transform failed with 4 errors: The symbol "clicking" has already been declared`) due to duplicated React `useState` hooks in the component scope.
**Impact:**
1. Moving CSS `@import` fixed CSS optimization warnings that could block the production build step or cause inconsistent CSS chunking.
2. Removing duplicated hooks unblocked the production build process by ensuring valid Javascript scoping rules.
**Learning:**
1. Vite's production CSS optimizer requires remote `@import` URLs to appear at the very top of CSS files, explicitly before even `@import "tailwindcss"`.
2. Duplicated state variables inside a React function component will crash `esbuild` during the production build step (`npm run build`), even if development environments (or un-minified code) are forgiving.
