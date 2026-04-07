## 2024-05-24 - Extract duplicated logic in resultController

**Before:** The `server/controllers/resultController.js` had inline definitions for `computeReactionId` and `classifyRegime` that duplicated logic already existing in shared utility files `server/utils/reactionHash.js` and `server/utils/regimeClassifier.js`.

**Issue:** Inline duplication of business logic makes it prone to logic drift and creates inconsistencies, especially for logic like regime classification and hashing IDs which are shared across different parts of the backend.

**Learning:** Always check the `server/utils/` directory for centralized utility functions before defining business logic inline in controllers. Re-using shared utilities prevents logic drift, inconsistent variable mappings, and makes the codebase more maintainable.
