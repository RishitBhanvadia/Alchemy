# CI Diagnostic Report - Action Required by Refactor/Debugger

**Context:** During the execution of Scout's market research task, CI failures occurred in the `build` and `test` jobs. As the Scout agent, my strict negative constraints prohibit me from modifying application code or CI workflow configurations.

**Issues Identified:**
1. **Node.js Engine Mismatch (Build Job):** The CI uses Node.js 18, but `@tailwindcss/oxide` requires Node.js >= 20.
   - *Fix:* Update `actions/setup-node` to `node-version: 20` in the CI workflows (`.github/workflows/ci.yml`, `build-check.yml`). Also define `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` in the workflow `env` to suppress Node 20 runner deprecation warnings.
2. **ESLint Failures (Test Job):** Multiple pre-existing ESLint errors exist in the codebase:
   - `client/src/pages/Lab3D.jsx`: unused `useCallback`.
   - `client/src/pages/AuthPage.jsx` & `client/src/components/auth/LoginForm.jsx`: Invalid `<a href="#">`. Replace with `<button type="button" onClick={(e) => e.preventDefault()}>`.
   - `client/src/components/auth/SignUpForm.jsx`: Invalid ARIA roles.
   - `client/src/components/auth/RoleCard.jsx`: Unused `Check` import.

These issues are documented here for the appropriate agent to resolve.

3. **Server Build Job Timeout:** The `build-server` CI job hangs and times out after 6 hours. This is because the inline check script (`node -e "try { require('./server.js') }..."`) executes `app.listen()` inside `server.js` and never exits.
   - *Fix:* Modify the inline script in `build-check.yml` to include a timeout or forced exit (`setTimeout(() => process.exit(0), 2000);`) so it verifies syntax/startup without blocking the CI runner.
