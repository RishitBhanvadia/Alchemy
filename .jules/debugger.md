## 2026-05-14 - Fix UI Components & Build Setup Issues
**Bug:** Build failed because of CSS ordering, and Playwright tests errored indicating crashes due to duplicate state hook declarations in React component.
**Root Cause:**
1. A `@import "tailwindcss";` rule preceded standard `@import url()` fonts config in `index.css`, violating standard CSS import order requirements.
2. A component `CursorFollower.jsx` was breaking Rules of Hooks by creating `useState` blocks directly under an early conditional exit line (`if (isTouchDevice) return null;`) while also duplicating existing variables defined a few lines higher.
**Learning:** Always check both variable bindings matching file scopes (linting would highlight variables redeclared within block) and make sure css `url()` imports precede library expansions in v4 Tailwind.

## 2026-05-14 - Fix GitHub CI Checking Pipeline Failures
**Bug:** The GitHub Actions CI pipeline failed primarily because:
1. Build workflows were using Node 18, causing npm to download packages incompatible with the required version bounds (specifically Tailwind `oxide` needing `>=20`), raising an `EBADENGINE` crash during build.
2. The testing logs indicated unused imports and unapproved `aria-role` assignments failing strictly-configured ESLint rules.
**Root Cause:**
1. Default github action templates used old syntax targeting Node 18, preventing modern Next.js/Tailwind configs from parsing correctly.
2. Abstract ARIA rules were violated because a prop simply named `role` was misconstrued by ESLint rules as an HTML property on components instead of a property mapped inside logic.
**Learning:** For repositories leveraging Tailwindv4 or modern frontend tools, Node configurations in GitHub Actions MUST be explicitly declared as 20 or higher. Also, when creating custom components expecting a generic "role", explicitly prefix the prop name (e.g. `userRole`) to prevent collision with React `jsx-a11y` DOM parsers.


## 2026-05-14 - Fix Conditional React Hook Render Failure
**Bug:** A React Hooks invariant was violated because `useState` / `useEffect` blocks were being initialized downstream of a conditional `return` logic exit (`if (isTouchDevice) return null;`).
**Root Cause:**
1. Code structure incorrectly assumed hooks could follow functional state exits within `CursorFollower.jsx` without consequence. React enforces uniform hook declaration ordering globally per render tree.
**Learning:** All `useEffect`, `useState`, `useCallback` block mappings inside functional components MUST occur prior to conditional returning components mapping.

## 2026-05-14 - Fix Conditional React Hook Render Failure
**Bug:** A React Hooks invariant was violated because `useState` / `useEffect` blocks were being initialized downstream of a conditional `return` logic exit (`if (isTouchDevice) return null;`).
**Root Cause:**
1. Code structure incorrectly assumed hooks could follow functional state exits within `CursorFollower.jsx` without consequence. React enforces uniform hook declaration ordering globally per render tree.
**Learning:** All `useEffect`, `useState`, `useCallback` block mappings inside functional components MUST occur prior to conditional returning components mapping.

## 2026-05-14 - Fix GitHub CI Server Test Hang
**Bug:** The GitHub Actions `build-server` action hung for exactly 6 hours, triggering a failure timeout.
**Root Cause:**
1. The CI pipeline used `node -e "try { require('./server.js') } ..."` to verify Express server syntax, but didn't cleanly exit. The `app.listen()` inside `server.js` keeps the Node.js event loop alive indefinitely.
**Learning:** Any CLI scripts invoking express initialization servers without automated exit configurations MUST invoke programmatic aborts (e.g. `setTimeout(() => process.exit(0), 1000);`) prior to importing files, preserving build limits from locking indefinitely.
