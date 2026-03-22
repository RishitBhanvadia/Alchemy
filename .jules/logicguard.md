## 2024-05-24 - Shadowed Error Function in Controller
**Bug:** When no matching database row is found in `resultController.js`, a `TypeError: error is not a function` is thrown instead of returning a proper 404 response.
**Root Cause:** The `let { data, error } = await supabase...` destructured variable shadowed the globally imported `const { error } = require('../utils/response')` helper function. When `data` is `null` (success, no row), `error` is also `null`/`undefined`, causing the function call to fail.
**Learning:** Always use alias names (e.g. `error: dbError`) when destructuring database errors if the same scope relies on an imported `error` function for response handling.
