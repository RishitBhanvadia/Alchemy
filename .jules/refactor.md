## 2025-06-15 - Replace Math.random with crypto.randomInt for generating codes
**Before:** `code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));` in `meetingController.js` and `classroomController.js`
**Issue:** `Math.random()` is not cryptographically secure, which makes meeting and classroom codes vulnerable to prediction, as stated in project memory.
**Learning:** For generating security-sensitive codes like meeting and classroom join codes, always use Node.js `crypto` module (`crypto.randomInt(0, max)`) instead of `Math.random()` to ensure cryptographically secure pseudo-randomness.
