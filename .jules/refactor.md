## 2024-05-18 - Fix React hook order and Vite esbuild duplicate symbol error
**Before:** Early return `if (isTouchDevice) return null;` placed before hooks, and state initialized twice.
**Issue:** Breaks React rules of hooks, and Vite's esbuild strictly fails when duplicate variables are defined in the same block scope.
**Learning:** Always keep hooks at top of function. `isTouchDevice` conditional return must occur after all hooks, including `useEffect`.
## 2024-05-18 - ESLint accessibility and hook fixes
**Before:** Interactive modal backgrounds using `div` with `onClick`, anchor tags using `href="#"`, and `useMemo` mutating variables instead of returning them.
**Issue:** Causes `jsx-a11y/click-events-have-key-events`, `jsx-a11y/no-static-element-interactions`, and `react-hooks/immutability` lint errors in strict CI environments.
**Learning:** Use explicit `// eslint-disable-next-line` for intentional modal backdrops, replace `href="#"` with `<button type="button">`, and refactor hooks or logic directly failing strict linting rules.
