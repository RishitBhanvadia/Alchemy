## 2025-02-18 - Incorrect Precedence in Regime Classifier
**Bug:** `classifyRegime` returns `ACID_DOMINANT` (or similar) when there is a tiny amount of Acid/Base but massive amount of Catalyst or Indicator. For instance, `{ chem_a: 1, chem_b: 0, chem_c: 30 }` classifies as `ACID_DOMINANT`.
**Root Cause:** The function evaluates `if (acidBaseSum > 0)` before checking Catalyst/Indicator specific threshold conditions. This acts as a catch-all that shadows the Catalyst and Indicator conditions whenever even a small amount of Acid or Base is present, incorrectly evaluating everything with any A/B as Acid/Base dominant.
**Learning:** Always ensure that more specific threshold conditions are evaluated before generic category checks (like `> 0`) to prevent misclassification.
