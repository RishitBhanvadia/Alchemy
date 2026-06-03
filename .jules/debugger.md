## 2026-06-03 - Fix server import hanging

**Bug:** `server.js` was triggering `app.listen()` and hanging during import execution in test environments (e.g. `node -e "require('./server.js')"` in CI), causing the CI job to hit the 6h timeout.
**Root Cause:** The `app.listen()` call and environment validation execution were not wrapped inside `if (require.main === module)` guard.
**Learning:** Always ensure Node entry points use `if (require.main === module)` before initializing side-effects like servers to allow safe module imports for testing or tooling.
