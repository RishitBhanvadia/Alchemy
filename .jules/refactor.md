## 2025-05-15 - Extracted Chemistry Logic to Utility

**Before:**
The `server/controllers/resultController.js` contained mixed concerns: request validation, complex chemical calculation logic (normalization, rounding, adjustment), and database interaction. The `calculateResult` function was long and hard to test in isolation.

**Issue:**
- **Single Responsibility Principle Violation:** The controller was doing too much.
- **Testability:** To test the calculation logic, one would have to mock the entire Express request/response object and the Supabase client.
- **Readability:** The business logic was buried inside the request handling code.

**Learning:**
Extracting pure business logic into a separate utility (`server/utils/chemistry.js`) made the code significantly cleaner.
- The controller is now focused solely on handling the HTTP request and database query.
- The calculation logic is now covered by comprehensive unit tests (`server/tests/chemistry.test.js`) without needing any mocks.
- This pattern of "skinny controllers, fat models/utilities" works well for this project and should be applied to other controllers if they grow.
