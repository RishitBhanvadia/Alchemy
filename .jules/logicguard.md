## 2026-05-17 - Fix remainder assignment in normalise
**Bug:** The fourth chemical absorbed all mathematical rounding remainders, causing it to evaluate >0% even if the user input was 0.
**Root Cause:** The calculation `nc = 100 - na - nb - ni` forced the last variable to close the gap to 100%, bypassing its actual mathematical ratio.
**Learning:** Normalization should independently round each item based on its exact ratio rather than blindly dumping remainders into the last parameter, which produces hallucinated elements or incorrect outcomes.