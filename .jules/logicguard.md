## 2024-03-24 - Remainder assignment in percentage normalization

**Bug:** Normalizing percentages to sum to 100 via a final remainder assignment (e.g. `nc = 100 - na - nb - ni`) caused inactive chemicals (originally 0) to receive a positive concentration percentage.
**Root Cause:** Rounding the initial fractions downward across three active chemicals left a remainder to reach 100. Blindly dumping that remainder into the final variable ignored whether that variable actually had presence initially.
**Learning:** Always explicitly distribute rounding differences based on presence/activation. Do not use generic remainder assignment for properties where zero *must* mean absence.
