## 2025-02-23 - Extract Duplicate Random Code Generation
**Before:** Duplicate `generateCode` and `generateClassCode` functions using insecure `Math.random()` existed across `meetingController.js` and `classroomController.js`.
**Issue:** Violates security constraints (Math.random is insecure for sensitive codes) and creates code duplication across controllers.
**Learning:** Extracting cross-cutting utilities like code generation into a centralized `server/utils` folder improves DRY-ness and ensures consistent, cryptographically secure code generation using `crypto.randomInt()`.
