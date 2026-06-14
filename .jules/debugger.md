## 2026-06-14 - React Hook Ordering and Tailwind CSS Imports
**Bug:** React compiler SyntaxError due to duplicate state declarations in `CursorFollower.jsx` and Vite build failing due to CSS import ordering in `index.css`.
**Root Cause:** The early return `if (isTouchDevice) return null;` was placed before `useEffect` hooks, violating React's Rules of Hooks. In Tailwind v4, `@import "tailwindcss";` is expanded into layers, meaning it must appear after external `@import url(...)` font imports to conform to CSS specifications.
**Learning:** Always ensure conditional returns appear after all React hooks are declared. When upgrading to Tailwind v4, standard CSS `@import` statements must precede the `@import "tailwindcss";` directive to avoid esbuild compilation failures.
