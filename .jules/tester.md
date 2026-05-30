# Tester Journal
## 2026-05-30 - Add tests for critical calculation logic
**Gap:** The critical business logic of resultController.js and algorithmic generation wasn't well-tested locally without needing full E2E testing.
**Learning:** Testing API controllers directly using mock request and response objects alongside jest.mock for dependencies like the database simplifies verifying logic.
**Pattern:** Mock the database responses explicitly (maybeSingle and single) based on test scenarios rather than running the real database queries to test backend reaction logic.
