## 2024-05-07 - Fix regime classifier logic

**Bug:** Catalyst and Indicator dominances were never reached if there was even a tiny amount of acid or base, classifying as NEUTRAL.
**Root Cause:** Acid-Base dominance (`acidBaseSum > 0`) was evaluated *before* Catalyst and Indicator dominances. Thus, any `chem_a` or `chem_b` value greater than 0 caused an early return.
**Learning:** Evaluated business logic checks should follow the required precedence, specifically evaluating stricter conditions (like specific dominances where combinations are minimal) before general fallback conditions.
