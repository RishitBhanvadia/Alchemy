## 2024-05-24 - Extract random string generation to utility

**Before:** The code used `Math.random().toString(36)...` or a local function generating a random string using `Math.random()` to generate codes in multiple places (`server/controllers/classroomController.js`, `server/controllers/meetingController.js`, `client/src/store/classroomStore.js`).
**Issue:** Using `Math.random()` to generate security-sensitive values like classroom or meeting codes is not cryptographically secure, and the code generator logic was duplicated across multiple locations.
**Learning:** Extracting code generation logic into a shared utility using `crypto.randomInt` (server) and `window.crypto.getRandomValues` (client) ensures consistent cryptographic security and removes duplication across the codebase.
