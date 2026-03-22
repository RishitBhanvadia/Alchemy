## 2024-11-20 - Fix ReferenceError from shadowed destructuring in calculateResult
**Bug:** The `calculateResult` endpoint threw a `ReferenceError: Cannot access 'error' before initialization` and crashed the server when returning validation errors.
**Root Cause:** The locally destructured variable `let { data, error } = await supabase...` shadowed the globally imported helper function `const { error } = require('../utils/response');`. Any use of `error()` before the `let` statement referenced the uninitialized local variable due to the Temporal Dead Zone (TDZ).
**Learning:** Always alias destructured variables (e.g., `let { error: dbError }`) that share names with imported global utility functions in the same block scope to avoid TDZ shadowing errors.
