## 2024-05-18 - LogicGuard: Duplicated code resulting in incorrect query parameters
**Bug:** The logic generating lookup keys in the `resultController` is slightly different to the core utility logic (`reactionHash.js` and `regimeClassifier.js`), causing silent query failures to Supabase due to mismatched positional weights (`i` and `c`).
**Root Cause:** The `computeReactionId` utility assigns `chem_c` a weight of 100, and `chem_i` a weight of 1000. However, the duplicated function in `resultController.js` flipped these, assigning `i` a weight of 100, and `c` a weight of 1000.
**Learning:** Duplicated logic must be systematically tracked down and removed. Core business rules mapping data should be encapsulated and reused rather than locally reimplemented to prevent silent divergences.
