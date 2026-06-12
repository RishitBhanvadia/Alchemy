## 2026-06-12 - Result Controller Using Duplicated Outdated Logic
**Bug:** The `resultController` calculates `reaction_id` and `regime` incorrectly because it duplicates its own logic with wrong thresholds and factors instead of using the canonical utilities `reactionHash` and `regimeClassifier`.
**Root Cause:** Duplicated code in `resultController.js` bypassed the correct threshold logic, assigning wrong identifiers, specifically for catalyst vs indicator multipliers and dominant regime classifications.
**Learning:** Always enforce DRY principles and import canonical logic utilities. Re-implementing hashing and classification logic locally leads to divergence and incorrect outputs in core business domains.
