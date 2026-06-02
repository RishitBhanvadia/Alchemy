## 2024-06-02 - Server Start Process Hang
**Bug:** The `build-server` CI job hangs indefinitely and eventually is killed due to exceeding the maximum execution time of 6 hours.
**Root Cause:** The `server.js` file unconditionally executed `app.listen()` and bounded to the PORT. When required by automated scripts or testing environments, the process would never close naturally.
**Learning:** Node.js Express server scripts must wrap `app.listen` calls in an `if (require.main === module)` conditional to prevent port binding when the module is simply required/imported by another script (like a test runner or CI checker) rather than being executed as the main process.
