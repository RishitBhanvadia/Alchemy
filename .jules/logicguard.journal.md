## 2025-03-09 - Missing standard API response wrapper breaks frontend
**Bug:** The `calculateResult` function in `server/controllers/resultController.js` returned direct JSON instead of wrapping the response in the standard `{ success: true, data: { ... } }` object. This caused the frontend axios interceptor to resolve `data` as `undefined`.
**Root Cause:** The controller circumvented the established `success()` and `error()` utility methods, directly calling `res.status(200).json(...)`, violating the architecture's standardization of API responses.
**Learning:** Always verify that API controllers use standard response wrappers, especially if a frontend client uses a global interceptor expecting a specific shape. Bypassing the wrapper causes silent data loss on the frontend.
