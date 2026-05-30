## 2025-05-30 - Fix hanging server during tests
**Bug:** The test suite or CI checks hang indefinitely because `server/server.js` automatically starts listening on a port and never closes the process.
**Root Cause:** The `app.listen()` block was executed unconditionally, keeping the Node process alive even when imported by a test runner like Jest or Supertest.
**Learning:** To prevent `server.js` from hanging during tests, wrap `app.listen()` inside `if (require.main === module)` so it only runs when executed directly. Export `module.exports = app;` so test runners can import the Express app without starting the actual server.
