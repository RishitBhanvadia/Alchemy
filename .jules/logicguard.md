## 2024-06-14 - Fix regime classification precedence
**Bug:** The logic ignored catalyst and indicator presence when classifying reaction regimes, causing misclassifications.
**Root Cause:** Early return condition `if (acidBaseSum > 0)` triggered before catalyst and indicator thresholds were evaluated. `resultController.js` also used a duplicated local method `classifyRegime(a, b)` instead of the correct global one `classifyRegime(a, b, i, c)`.
**Learning:** Always evaluate specialized overrides or precedence conditions before evaluating generic conditions, and remove duplicate isolated logic.
