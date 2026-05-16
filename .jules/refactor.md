## 2024-05-16 - Extract onOrNot magic function into descriptive util
**Before:** Repeated `function onOrNot()` logic calculating boolean by counting non-zero chemical quantities.
**Issue:** `onOrNot` is poorly named and the exact same counting loop appears in multiple files, breaking DRY. Magic number 2.
**Learning:** Extract chemical readiness validation to a utility function `hasSufficientReactants(chemicals: number[]): boolean` for better semantics and reusability.
