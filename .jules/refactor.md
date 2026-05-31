## 2026-05-31 - Refactoring Duplicate Code Generation Logic
**Before:** `meetingController.js` and `classroomController.js` both had duplicated code generation and unique-checking logic (`generateCode` / `generateUniqueCode` / `generateClassCode`).
**Issue:** Code duplication violates DRY principles. The logic was almost identical but duplicated, making it harder to maintain and prone to inconsistencies.
**Learning:** Extracting code generation logic into a shared utility (`server/utils/codeGenerator.js`) centralizes the code generation logic, improving maintainability and ensuring consistent behavior across different controllers.
