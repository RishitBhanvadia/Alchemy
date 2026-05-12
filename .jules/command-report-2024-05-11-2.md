## 2024-05-11 - Esbuild Duplicate Identifier and React Hooks Early Return Fixes

**Vulnerability:** CI `vite build` failed during esbuild transform with `ERROR: The symbol "clicking" has already been declared` and multiple ESLint warnings were present.
**Fixes:**
1. Fixed `client/src/components/CursorFollower.jsx` by removing duplicated `useState` declarations.
2. Adhered to `react-hooks/rules-of-hooks` by moving the early return `if (isTouchDevice) return null;` below all hook declarations in `CursorFollower.jsx`.
3. Addressed the remaining `jsx-a11y` errors and `no-console` warnings across multiple component files to unblock CI.
