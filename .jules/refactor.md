## 2024-03-08 - Extract chemical array map in result controller
**Before:** Manual iteration over `chem_a`, `chem_b`, `chem_c`, `chem_d` via repetitive lets, rounding, normalizing.
**Issue:** Too much duplicate code trying to handle 4 identical variables.
**Learning:** Arrays with `map` and `reduce` are a better fit here, although modifying `resultController` is slightly risky due to Supabase calls. We can refactor `client/src/pages/lab.jsx` instead, which has extensive repetition.
