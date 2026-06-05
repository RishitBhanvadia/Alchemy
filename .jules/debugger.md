## 2025-06-05 - Fix API Validation for Reaction Payload
**Bug:** The `/results` API endpoint returned a 400 Bad Request error when a user attempted to submit a reaction because the validation middleware checked for `chem_d` instead of `chem_i`.
**Root Cause:** The `reaction` schema in `server/middleware/validate.js` was hardcoded to validate `chem_a`, `chem_b`, `chem_c`, and `chem_d`, but the actual data sent from the client (`client/src/store/labStore.js`) included `chem_i` (representing the Indicator) and omitted `chem_d`.
**Learning:** Always ensure backend validation schemas stay synchronized with the actual payloads constructed by frontend stores, especially when domain-specific terminology (like 'indicator' -> `chem_i`) diverges from sequential variable naming (`chem_d`).
