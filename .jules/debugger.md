## 2024-06-19 - Duplicate State Declaration
**Bug:** Build failure (`vite build` failed with "The symbol 'clicking' has already been declared")
**Root Cause:** A merge conflict or copy-paste error left duplicate `useState` hooks for `clicking` and `hovering` in `client/src/components/CursorFollower.jsx`
**Learning:** Always run local builds (`pnpm build`) before pushing frontend changes. The dev server may sometimes be more lenient, or ignore files not actively rendered, but Vite's production build will strictly enforce JS syntax like duplicate variable declarations.
