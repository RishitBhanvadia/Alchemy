## 2024-05-03 - Fix Catalyst and Indicator Dominance Evaluation
**Bug:** Catalyst and Indicator dominances were never evaluated if any amount of acid or base (A+B > 0) was present, returning NEUTRAL instead.
**Root Cause:** The logic block for `acidBaseSum > 0` returned a value immediately, bypassing the Catalyst and Indicator checks which are designed to handle scenarios where A+B < 20.
**Learning:** Evaluation order of conditional business logic blocks is critical; checks for independent or overriding conditions (like Catalyst dominance when A+B is small) must be evaluated before broader catch-all checks.
