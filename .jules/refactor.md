## 2024-05-15 - Extract random code generation into a utility function using CSPRNG
**Before:** Duplicate code for generating random alphanumeric strings using `Math.random` across `server/controllers/meetingController.js` and `server/controllers/classroomController.js`.
**Issue:** Code duplication and security vulnerability (using predictable `Math.random` instead of CSPRNG for access codes).
**Learning:** Extracting common code generation logic into a shared utility function improves maintainability, reduces duplication, and allows fixing security vulnerabilities in a single place.
