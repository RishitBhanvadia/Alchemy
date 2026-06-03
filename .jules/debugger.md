## 2026-06-03 - Fix `if (require.main === module)` for tests
**Bug:** The `build-server` test step failed with hanging execution due to `app.listen()` and `validateEnv()` executing during imports in test environments.
**Root Cause:** `server/server.js` was missing an `if (require.main === module)` wrapper around server initialisation logic as per memory guidelines.
**Learning:** Always ensure Express applications check `if (require.main === module)` before listening on a port to allow for safe testing imports.
