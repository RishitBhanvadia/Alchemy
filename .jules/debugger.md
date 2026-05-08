## 2023-10-27 - [Duplicate useState Declarations in esbuild]
**Bug:** `vite build` failed during the build pipeline with esbuild throwing "The symbol 'clicking' has already been declared" and similar errors.
**Root Cause:** There were duplicate `useState` hook declarations for `clicking` and `hovering` located back-to-back in `CursorFollower.jsx`, and an early return before the hooks causing potential hook rule violations.
**Learning:** During `vite build`, esbuild strictly enforces variable declarations and will throw build-breaking errors (e.g., 'The symbol [name] has already been declared') if there are duplicate hooks or variables within a component's scope. Ensure components are cleanly formatted, hooks are not duplicated, and early returns follow the rules of hooks.
