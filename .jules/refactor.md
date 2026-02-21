## 2026-02-21 - Controller Logic Extraction
**Before:** A single 70-line controller function (`calculateResult`) mixed input validation, complex business logic (normalization/rounding/id calc), and database queries.
**Issue:** The function was hard to test because business logic was tightly coupled with database and request handling. The logic for rounding adjustments was particularly subtle and buried.
**Learning:** Extracting pure computational logic into a helper function (`calculateChemicalStats`) allowed for direct unit testing of complex rules without needing to mock the entire request/response cycle or database. This pattern of separating pure logic from side-effects (IO) significantly simplifies testing and maintenance.
