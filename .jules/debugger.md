## 2026-05-09 - Duplicate Hook Declarations Breaking Vite Build
**Bug:** Client Vite build failed with esbuild errors ("The symbol has already been declared") inside `CursorFollower.jsx`.
**Root Cause:** The state variables `clicking` and `hovering` were declared twice. Additionally, an early return (`if (isTouchDevice) return null;`) was placed before a hook (`useEffect`), which violates the Rules of Hooks and causes issues.
**Learning:** Vite's esbuild strictly enforces variable declarations and will throw build-breaking errors for duplicates, even if dev tools tolerate them. Early component returns must be placed *after* all hook declarations to avoid conditional hook calls.
