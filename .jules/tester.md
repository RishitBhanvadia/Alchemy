## 2024-03-09 - Backend API Tests
**Gap:** The API endpoint `GET /result/:a/:b/:c/:d` had insufficient coverage for its mathematical normalization and adjustment rules (e.g. making sure percentages add up perfectly to 100 after rounding).
**Learning:** Proper test coverage of API input parameters often involves testing tricky rounding situations that trigger fallback logic, like `Math.max` and `Math.min` adjustments. Ensure all logic branches on math boundary conditions are explicitly tested.
**Pattern:** Directly mocking controller responses from Database calls while iterating through input edge cases via `supertest` allows isolating math coverage accurately.
