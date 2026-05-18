## 2026-05-18 - [Accessibility Improvements in Authentication]
**Bug:** The authentication components (AuthPage, LoginForm) had invalid `href="#"` anchor tags which causes jarring scrolling behavior when clicked, leading to `jsx-a11y/anchor-is-valid` errors. Additionally, `SignUpForm` passed 'student' and 'teacher' as values to the `role` prop of `RoleCard`, which triggered `jsx-a11y/aria-role` because those are invalid ARIA roles.
**Root Cause:** Using anchor tags as generic clickable text elements without valid destinations, and reusing the HTML `role` attribute keyword as a custom prop name.
**Learning:** To prevent accessibility lint errors, always use `<button type="button">` for click handlers that don't navigate, using utility classes like `bg-transparent border-none p-0 cursor-pointer` to keep link-like styling. Never use HTML/ARIA reserved attributes like `role` for custom component prop names (use `userRole` instead).
## 2026-05-18 - [Fix unused imports and multiple declarations]
**Bug:** CI failed due to unused `useCallback`, `Check` and `Loader2` variables as well as `clicking` and `hovering` variables being declared multiple times in `CursorFollower.jsx`.
**Root Cause:** Extraneous copy-paste errors or leftover code during refactoring caused multiple declarations of variables and imports to be unused.
**Learning:** Ensure code is linted regularly to catch unused variables and multiple declarations that could cause build and CI pipeline failures.
## 2026-05-18 - [Fix CSS build errors and CI Node.js deprecations]
**Bug:** The CI pipeline was failing because `@import "tailwindcss";` appeared before `@import url(...)` in `index.css`, violating CSS syntax rules and causing `vite build` to crash. Additionally, GitHub Actions warned about Node 20 deprecation.
**Root Cause:** In Tailwind CSS v4, the `@import "tailwindcss";` directive must appear *after* native `@import url(...)` statements for fonts.
**Learning:** Always put native CSS `@import url(...)` before the Tailwind v4 `@import "tailwindcss";` directive. Maintain CI workflow files by proactively upgrading `node-version` to supported versions (e.g. 20.x).
## 2026-05-18 - [Fix CI server hang]
**Bug:** The GitHub Actions CI `build-server` job was timing out after 6 hours when requiring `server.js`.
**Root Cause:** The `server.js` script starts an Express server which keeps the Node.js process alive indefinitely, causing the CI runner to hang.
**Learning:** When testing server startup in CI using `require('./server.js')`, always include a timeout (e.g. `setTimeout(() => process.exit(0), 1000)`) to forcefully exit the process and prevent the job from hanging.
