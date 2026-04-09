## 2024-06-03 - Extract Cryptographically Secure Code Generation Utility
**Before:** Duplicate code blocks generating random strings using the predictable `Math.random()` in both `classroomController.js` and `meetingController.js`.
**Issue:** `Math.random()` is not secure for generating meeting codes or class codes. The logic was also duplicated, making it harder to maintain.
**Learning:** Extracting code generation logic into a reusable utility module using Node's `crypto.randomInt` centralises the functionality, improves security and predictability, and keeps controllers focused on their business logic.
