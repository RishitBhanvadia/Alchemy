## 2024-05-05 - Fix Regime Classifier Order
**Bug:** Catalyst and Indicator dominances were being shadowed by general Acid-Base dominance when minimal amounts of acid or base were present (acidBaseSum > 0).
**Root Cause:** The `acidBaseSum > 0` check returned early with `NEUTRAL`, `ACID_DOMINANT`, or `BASE_DOMINANT` before evaluating Catalyst or Indicator checks that specifically permit `acidBaseSum < 20`.
**Learning:** Evaluated narrower boundary conditions or specific combinations (like minimal background chemicals) before broader catch-all checks to prevent shadowing.
