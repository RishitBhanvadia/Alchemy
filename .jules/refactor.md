## 2024-05-29 - Extract Duplicate Insecure Code Generation
**Before:** The `generateCode` and `generateClassCode` functions existed separately in two different controllers, duplicating the generation logic and using `Math.random()`, which is not cryptographically secure and poses a security risk for access codes.
**Issue:** Code duplication and reliance on a predictable pseudo-random number generator for sensitive meeting and classroom codes.
**Learning:** Extracting common generation logic into a shared utility (`server/utils/codeGenerator.js`) and replacing `Math.random()` with `crypto.randomInt` improves maintainability, reduces duplication, and complies with security best practices for CSPRNG usage in Node.js.
