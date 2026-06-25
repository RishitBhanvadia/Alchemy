## 2024-06-25 - Extract Duplicate Code Generator
**Before:** `generateCode` logic was duplicated in `meetingController.js` and `classroomController.js`.
**Issue:** Copy-paste programming violates DRY and makes it harder to update the logic (e.g., if we want to remove confusing characters like '0' and 'O').
**Learning:** Extracting pure utility functions like ID generation to a shared utility file (`server/utils/codeGenerator.js`) improves maintainability and reduces duplication.
