## 2025-04-27 - Duplicate State Declarations Cause Vite Build Failure
**Bug:** The client application fails to build via `npm run build` using Vite.
**Root Cause:** The `CursorFollower.jsx` component contained duplicated `useState` declarations (`clicking` and `hovering`). This causes esbuild to fail with an "has already been declared" error during the production build step.
**Learning:** Duplicate state declarations within the same component scope will cause esbuild to crash during Vite production builds. Always ensure state declarations are unique per component scope, and keep early return statements (like checking for touch devices) after all React hook declarations to satisfy `react-hooks/rules-of-hooks` in strictly linted environments.
