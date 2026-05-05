## 2025-05-05 - Extract secure code generator utility
**Before:** Duplicate code generation logic using predictable `Math.random()` existed in multiple controllers (meetingController.js, classroomController.js).
**Issue:** `Math.random()` is not secure for generating security-sensitive identifiers (codes/tokens), and having duplicate implementations hurts maintainability.
**Learning:** Extracting a shared code generation utility leveraging Node.js `crypto.randomInt()` reduces duplication and satisfies secure randomness requirements for identifiers, centralizing this cross-cutting concern.
