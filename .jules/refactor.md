## 2024-05-22 - Extracted Calculation Logic
**Before:** Chemical adjustment logic was mixed with controller validation and DB queries.
**Issue:** Complex calculation logic made the controller hard to test and prone to subtle bugs (e.g., division by zero if all inputs were 0).
**Learning:** Extracting business logic into pure functions allows for exhaustive unit testing of edge cases (like all-zero inputs) that are difficult to simulate in integration tests. This revealed a potential NaN bug.
