2024-05-23 - Fix build-server CI hanging on test execution
**Bug:** The `build-server` CI job exceeded its execution time limit because the Express server initialized and listened unconditionally when imported into test files.
**Root Cause:** `server/server.js` did not conditionally wrap the `app.listen()` block or export the `app`, causing tests that required it to start an indefinite listening process that blocked teardown.
**Learning:** Always use `if (require.main === module)` to wrap server initialization blocks to distinguish between direct script execution (starting the server) and importing the module for test frameworks like Jest.
