## 2026-03-13 - Fix division by zero
**Vulnerability:** Division by zero when all inputs are 0
**Learning:** Missing zero-sum check in chemical normalization logic caused division by zero resulting in NaN.
**Prevention:** Add guard condition `add > 0` before normalising.
