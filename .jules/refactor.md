## 2026-04-24 - Extracted secure code generation logic
**Before:** Both `classroomController.js` and `meetingController.js` had separate, duplicated `Math.random()`-based code generation logic strings.
**Issue:** Using `Math.random()` for secure tokens like meeting codes is a vulnerability, and having duplicate logic violated the DRY principle.
**Learning:** Extracting standard functions (like secure token generators) into shared utilities not only prevents vulnerabilities but cuts down on code duplication.
