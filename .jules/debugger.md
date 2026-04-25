## 2024-04-25 - React Hook Early Return Causing Uncaught Syntax Errors

**Bug:** App/build fails due to `SyntaxError` (Duplicate declaration of variables) in `CursorFollower.jsx`. Multiple React ESLint accessibility errors were also found.
**Root Cause:** Two instances of the same `useState` declarations existed for `clicking` and `hovering`. They were placed below an early return statement (`if (isTouchDevice) return null;`). Although duplicate declarations trigger the `SyntaxError` first, calling a React Hook *after* an early conditional return violates the Rules of Hooks and causes unpredictable renders.
**Learning:** In Vite projects, syntax errors like duplicate identifier declarations cause build failure. Additionally, always place conditional early return statements after all React hook calls to ensure hooks execute in the exact same order on every render.
## 2024-04-25 - CI Pipeline Failures Due to Outdated Node Version

**Bug:** GitHub Actions CI pipelines fail during `npm ci` with `EBADENGINE` errors ("Unsupported engine").
**Root Cause:** The `node-version` in `.github/workflows/*.yml` was set to `18`. Modern dependencies (like `@tailwindcss/oxide`) now require Node.js >= 20, causing `npm ci` to fail the build.
**Learning:** When adding modern dependencies or investigating CI build failures, verify the `node-version` matrix in all GitHub workflows matches the project's requirements (Node.js 20+).
## 2024-04-25 - CI Pipeline Failures Due to Unused Variables

**Bug:** GitHub Actions CI pipelines fail during the `npm run lint` step with `no-unused-vars` errors.
**Root Cause:** The `client/src/pages/Lab3D.jsx`, `client/src/components/auth/RoleCard.jsx`, and `client/src/components/auth/CTAButton.jsx` files contained unused imports. The CI environment strictly enforces the `no-unused-vars` rule, causing the build to fail.
**Learning:** Always remove unused variables and imports before submitting code, as CI environments often treat these linting warnings as fatal errors.
## 2024-04-25 - CI Pipeline Timeouts Due to Unclosed Event Loops

**Bug:** GitHub Actions `build-server` jobs exceed the maximum 6-hour runtime and are forcibly canceled.
**Root Cause:** The pipeline runs an inline bash step (`node -e "try { require('./server.js') }..."`) to verify server startup. Because `server.js` naturally calls `app.listen()` and establishes active network listeners, the Node.js event loop remains open indefinitely, preventing the script from exiting gracefully.
**Learning:** When writing simple "smoke tests" or inline validation scripts for an Express server in CI pipelines, ensure that you forcibly close the event loop (e.g., using `setTimeout(() => process.exit(0), 2000);`) after the required startup logic runs.
