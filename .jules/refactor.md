## 2025-04-22 - Extract secure code generation utility

**Before:** Predictable strings were created in multiple places via inline loops calling `Math.random()` and directly concatenating static strings (e.g., in `meetingController.js` and `classroomController.js`).

**Issue:** `Math.random()` is not cryptographically secure, which poses a vulnerability for generation of authentication joining codes. It also violated the DRY principle with nearly identical logic existing in multiple modules. Furthermore, there was a duplicate declaration of state variables in `CursorFollower.jsx` incorrectly positioned after a conditional return which caused compilation and React hook violations.

**Learning:** When refactoring across backend API controllers, isolating common cross-cutting logic like token generation into a generic standalone utility function prevents duplication. Moreover, when using Node.js, `crypto.randomInt` serves as an excellent drop-in replacement for random integer generation with greater cryptographic security. Also, ensuring that standard structural repairs (like removing duplicate Hooks violations blocking standard production builds) go hand-in-hand with standard refactors ensures CI pipelines run correctly.
