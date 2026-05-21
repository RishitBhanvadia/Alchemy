## 2024-05-21 - Flatten Deeply Nested Conditionals with Early Returns
**Before:** `client/src/pages/lab.jsx` contained a `change_tip()` function that utilized 4 levels of nested `else if` statements to set a color state based on chemical variables.
**Issue:** Deep nesting increases cyclomatic complexity, making code harder to read, maintain, and reason about, as readers have to hold the entire conditional tree in memory.
**Learning:** Utilizing early returns inside small utility functions flattens the logic tree into sequential guard clauses. This improves readability dramatically, especially when checking mutually exclusive conditions where the first match should short-circuit the execution.
