## 2026-05-04 - Fix logic order of dominance evaluation in regime classifier
**Bug:** Small amounts of acid or base incorrectly mask Catalyst and Indicator dominances, resulting in a false `NEUTRAL` classification.
**Root Cause:** The Acid-Base dominance check (`acidBaseSum > 0`) is evaluated before Catalyst and Indicator dominances, prematurely returning `NEUTRAL` when a reaction should be Catalyst/Indicator dominant.
**Learning:** In cascading logical checks, specific conditions (like Catalyst or Indicator dominances with minimal base/acid) must be evaluated before broader, general conditions (like any Acid-Base mixture) to prevent false positives and masking behavior.
