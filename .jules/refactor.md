## 2024-05-18 - Extract secure code generator utility
**Before:** `Math.random()` was used to generate 5-character classroom codes and 6-character meeting codes, with logic duplicated in both controllers.
**Issue:** `Math.random()` is not cryptographically secure and is predictable, which is unsafe for generating access tokens/codes. Additionally, the duplication violated the DRY principle.
**Learning:** Extracted code generation into a shared utility `server/utils/codeGenerator.js` using Node.js `crypto.randomInt()`, improving security and centralising the logic.
