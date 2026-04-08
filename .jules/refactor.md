## 2024-05-18 - Extracted common code generator
**Before:** Duplicate code to generate random character strings existed in both `classroomController.js` and `meetingController.js`.
**Issue:** Violates DRY principle and makes it hard to maintain.
**Learning:** Extracting common string generation functions to a utility directory improves code maintainability.
