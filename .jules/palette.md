
## 2024-05-17 - Update Actions Node Version & Fix CSS Imports
**Learning:** GitHub Actions using Node 18 trigger deprecation warnings and can cause `npm ci` / `vite build` to fail when dependencies like `@tailwindcss/oxide` require native bindings for Node 20+. Additionally, Vite + Tailwind v4 build processes fail if native CSS `@import` statements (like Google Fonts) are placed *after* `@import "tailwindcss";`.
**Action:** Keep GitHub Actions `setup-node` tasks on Node 20+ to unblock CI. Always place native `@import url(...)` statements at the very top of the entry CSS file before any Tailwind directives.

## 2024-05-17 - Prevent CI Hang on Express Server Startup Tests
**Learning:** In the Alchemistry repository, when testing the Express server startup in CI/CD pipelines (e.g., via `require('./server.js')`), the server process will stay alive indefinitely because the Express listener blocks the Node event loop. This leads to job timeouts (e.g., 6 hours).
**Action:** When running automated build checks that require starting the server simply to verify syntax and initialization, wrap the execution with a timeout to forcefully exit (e.g., `setTimeout(() => process.exit(0), 1000);`).
