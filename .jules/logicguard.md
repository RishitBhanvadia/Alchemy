## 2025-02-18 - Fix Validation Logic Discrepancy for Reactions
**Bug:** The `reaction` validator expected `chem_d` instead of `chem_i` for chemical concentrations, causing valid requests to fail validation since the rest of the application (and controllers like `resultController.js`) processes `chem_i`.
**Root Cause:** The `reaction` validation schema was hardcoded to check for `chem_d` instead of `chem_i`, misaligning with the core business logic models for the chemical reaction data payload.
**Learning:** Always ensure validation schemas perfectly match the expected keys used by downstream controllers and core logic. A discrepancy here can cause silently rejected inputs and degrade application reliability.
