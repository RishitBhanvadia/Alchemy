## 2024-04-25 - React Hook Early Return Causing Uncaught Syntax Errors

**Bug:** App/build fails due to `SyntaxError` (Duplicate declaration of variables) in `CursorFollower.jsx`. Multiple React ESLint accessibility errors were also found.
**Root Cause:** Two instances of the same `useState` declarations existed for `clicking` and `hovering`. They were placed below an early return statement (`if (isTouchDevice) return null;`). Although duplicate declarations trigger the `SyntaxError` first, calling a React Hook *after* an early conditional return violates the Rules of Hooks and causes unpredictable renders.
**Learning:** In Vite projects, syntax errors like duplicate identifier declarations cause build failure. Additionally, always place conditional early return statements after all React hook calls to ensure hooks execute in the exact same order on every render.
