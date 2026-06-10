## 2025-03-01 - Replace Math.random with crypto.randomInt for generating secure codes
**Before:** Controllers were using `Math.random()` to generate classroom and meeting codes.
**Issue:** `Math.random()` is not cryptographically secure, which could lead to predictable codes, and the codebase has explicit instructions (in memory/AGENTS.md) to use `crypto.randomInt` for generating codes. Also, there's duplication of the code generation logic between `classroomController.js` and `meetingController.js`.
**Learning:** Extracting code generation logic to a shared utility using `crypto.randomInt` improves security and reduces duplication.
