
## 2024-05-17 - Prevent CI Hang on Express Server Startup Tests
**Learning:** In the Alchemistry repository, when testing the Express server startup in CI/CD pipelines (e.g., via `require('./server.js')`), the server process will stay alive indefinitely because the Express listener blocks the Node event loop. This leads to job timeouts (e.g., 6 hours).
**Action:** When running automated build checks that require starting the server simply to verify syntax and initialization, wrap the execution with a timeout to forcefully exit (e.g., `setTimeout(() => process.exit(0), 1000);`).
