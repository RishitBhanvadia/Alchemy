## 2024-05-30 - Fix hardcoded logic divergence

**Bug:** `server/controllers/resultController.js` redefined business logic for `computeReactionId` and `classifyRegime` directly instead of using the central utilities `reactionHash.js` and `regimeClassifier.js` found in `server/utils/`.

**Root Cause:** A refactor or initial implementation duplicated the computation logics which led to inconsistent results (for example, fuzzy matching logic differently configured and lack of `chem_i` / `chem_c` parameters logic passing locally within `resultController.js`).

**Learning:** Business logics specific to computation or regime classification shouldn't be redefined locally. Always import and use centrally implemented utilities across endpoints and tests to keep consistency.
