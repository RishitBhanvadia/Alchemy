## 2025-05-30 - Fix hanging server during tests
**Bug:** The test suite or CI checks hang indefinitely because `server/server.js` automatically starts listening on a port and never closes the process.
**Root Cause:** The `app.listen()` block was executed unconditionally, keeping the Node process alive even when imported by a test runner like Jest or Supertest.
**Learning:** To prevent `server.js` from hanging during tests, wrap `app.listen()` inside `if (require.main === module)` so it only runs when executed directly. Export `module.exports = app;` so test runners can import the Express app without starting the actual server.
## 2025-05-30 - Fix client build EBADENGINE issue
**Bug:** The Vite build step failed in CI with `EBADENGINE` and `Cannot find native binding` related to Tailwind CSS plugins and Node.js 18.
**Root Cause:** The locally installed `@tailwindcss/vite` and `@tailwindcss/postcss` packages had a mismatched engine resolution on `npm ci` with `lru-cache` on Node 18, triggering the native binding error.
**Learning:** Running `npm install @tailwindcss/vite@latest @tailwindcss/postcss@latest tailwindcss@latest` successfully resolved the native binding and EBADENGINE errors. Ensure the package versions align correctly across environments. Also, `npm run build` now completes successfully.
