
## 2024-05-06 - Extract secure code generator utility
**Before:** Duplicate `Math.random()` string generators in `classroomController.js` and `meetingController.js`. `Math.random()` is also not cryptographically secure, which is a security issue for meeting codes and classroom codes.
**Issue:** Code duplication and security vulnerability from using `Math.random()` for code generation.
**Learning:** Extracting duplicate code into a shared utility using `crypto.randomInt` improves maintainability, DRY, and security in one move.
