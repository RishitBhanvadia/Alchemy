## 2026-06-07 - Fix reaction API validation logic mismatch
**Bug:** The `/results` API returned a 400 Bad Request error because the `reaction` validator expected `chem_d` instead of `chem_i`.
**Root Cause:** The frontend sends the reaction payload with `chem_i` (Indicator), but the backend validation logic was hardcoded to check for `chem_d`, causing validation to fail.
**Learning:** Ensure backend API validation schemas strictly align with the client payloads and domain logic naming conventions.
