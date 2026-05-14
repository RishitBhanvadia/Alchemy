## 2026-05-14 - Fix UI Components & Build Setup Issues
**Bug:** Build failed because of CSS ordering, and Playwright tests errored indicating crashes due to duplicate state hook declarations in React component.
**Root Cause:**
1. A `@import "tailwindcss";` rule preceded standard `@import url()` fonts config in `index.css`, violating standard CSS import order requirements.
2. A component `CursorFollower.jsx` was breaking Rules of Hooks by creating `useState` blocks directly under an early conditional exit line (`if (isTouchDevice) return null;`) while also duplicating existing variables defined a few lines higher.
**Learning:** Always check both variable bindings matching file scopes (linting would highlight variables redeclared within block) and make sure css `url()` imports precede library expansions in v4 Tailwind.
