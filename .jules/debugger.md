## 2024-05-12 - Duplicate React hook declarations causing build failure
**Bug:** The application fails to build due to duplicate variable declarations (`clicking`, `setClicking`, `hovering`, `setHovering`) in `CursorFollower.jsx`, and a `React Hook is called conditionally` rule violation because an early return (`if (isTouchDevice) return null;`) is placed before the hook declarations.
**Root Cause:** The `useState` hooks for `clicking` and `hovering` were accidentally duplicated, with the second set placed after a conditional early return.
**Learning:** Always ensure React hooks are declared at the top level of a component, before any conditional returns. Vite/esbuild will fail the build if variables are redeclared in the same scope.
