## 2023-10-27 - [CI Background Server Timeout]
**Bug:** The `build-server` job in GitHub Actions hangs and eventually times out (exceeding 6h).
**Root Cause:** The verification script (`node -e "require('./server.js')"`) starts the Express server, which keeps the Node.js event loop alive indefinitely waiting for connections, thus causing the GitHub Actions step to hang.
**Learning:** When running persistent background servers in CI verification scripts, always implement an explicit timeout or exit condition (e.g., `setTimeout(() => process.exit(0), 1000);`) to prevent hanging pipelines.
