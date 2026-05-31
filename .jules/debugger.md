2026-05-31 - Fix Server Hang in CI
**Bug:** The `build-server` CI job hung indefinitely, exceeding the 6-hour limit.
**Root Cause:** `server/server.js` unconditionally called `app.listen()`, meaning whenever the CI script required it to check for startup failures, it kept the process running and the port open.
**Learning:** Always wrap `app.listen()` inside `if (require.main === module) { ... }` and export the Express `app` instance. This allows tests and CI scripts to require the file safely without starting a lingering server process.
