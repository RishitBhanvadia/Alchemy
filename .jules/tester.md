## 2024-05-22 - Extracted Critical Logic for Testing
**Gap:** Complex chemical concentration calculation logic was embedded inside `server/controllers/resultController.js`, making it untestable without mocking the entire server and database.
**Learning:** Extracting pure business logic into a separate utility function (`server/utils/concentrationLogic.js`) allows for comprehensive unit testing of edge cases (like rounding errors and zero-sum inputs) that were previously hidden or tested only via integration tests.
**Pattern:** Logic Extraction & Unit Testing.
