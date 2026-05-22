
## $(date +%Y-%m-%d) - Fix Vite/esbuild Build Failures in React Client
**Bug:** The client build failed with two distinct errors: one related to duplicate variable declarations in `CursorFollower.jsx` (`The symbol "clicking" has already been declared`) and one related to CSS `@import` ordering in `index.css` (`@import rules must precede all rules aside from @charset and @layer statements`).
**Root Cause:**
1. In `CursorFollower.jsx`, an early return (`if (isTouchDevice) return null;`) was placed between two identical sets of `useState` declarations. The second set of declarations caused syntax errors. Furthermore, the early return violated React's Rules of Hooks because `useState` and `useEffect` were conditionally bypassed.
2. In `index.css`, the native CSS `@import` for Google Fonts was placed below the `@import "tailwindcss";` directive, violating esbuild's CSS parsing rules which require native `@import`s to precede all other rules except `@charset` and `@layer`.
**Learning:** Always ensure native CSS `@import`s are placed at the very top of the entry CSS file, particularly when using Vite and Tailwind CSS v4. Additionally, ensure all React Hooks are called unconditionally before any early return statements to prevent hook ordering bugs and build errors.
