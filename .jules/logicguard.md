## 2025-05-22 - Fix Regime Classifier Logic Error
**Bug:** classifyRegime prematurely returned Acid-Base regimes and bypassed Indicator/Catalyst regimes if even a trace amount of Acid/Base was present.
**Root Cause:** The `if (acidBaseSum > 0)` block was evaluated first and always returned, making the `acidBaseSum < 20` condition in subsequent blocks dead code.
**Learning:** Always check edge cases with overlapping condition logic and review control flow to ensure early returns do not mask other intended behaviors.
