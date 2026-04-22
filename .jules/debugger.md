## 2025-04-22 - Fix CI server execution timeout

**Bug:** The `.github/workflows/build-check.yml` pipeline failed via a 6-hour execution timeout on the `Check server syntax/startup` step.

**Root Cause:** The inline Node.js validation script (`node -e "try { require('./server.js') } catch (e) { ... }"`) imported `server.js`, which automatically started an Express app listening on a port. Because the server process kept the event loop alive, the script hung indefinitely in the CI runner environment.

**Learning:** When validating a Node backend script that executes immediately on import (i.e. not exporting the server function but rather directly calling `app.listen()`), always include a hard kill mechanism like `setTimeout(() => process.exit(0), 2000);` within the inline runner script to force a graceful termination upon successful instantiation.
