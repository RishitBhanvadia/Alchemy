## 2024-05-18 - Fix React hook order and Vite esbuild duplicate symbol error
**Before:** Early return `if (isTouchDevice) return null;` placed before hooks, and state initialized twice.
**Issue:** Breaks React rules of hooks, and Vite's esbuild strictly fails when duplicate variables are defined in the same block scope.
**Learning:** Always keep hooks at top of function. `isTouchDevice` conditional return must occur after all hooks, including `useEffect`.
