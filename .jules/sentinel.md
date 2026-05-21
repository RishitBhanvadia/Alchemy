## 2024-05-21 - Insecure Code Generation
**Vulnerability:** Weak random number generator (`Math.random()`) was being used for generating sensitive access codes (`generateCode()` in `meetingController.js` and `generateClassCode()` in `classroomController.js`).
**Learning:** `Math.random()` is predictable and not suitable for cryptographic security or access codes.
**Prevention:** Always use a cryptographically secure pseudo-random number generator (CSPRNG) like Node's built-in `crypto.randomInt()` or `crypto.randomBytes()` when generating secrets, tokens, or access codes.
