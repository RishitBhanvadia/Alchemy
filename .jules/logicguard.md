## 2024-05-18 - Missing Standardized Response Format Breaks Frontend Handling
**Bug:** The `calculateResult` function in `resultController.js` returned data as raw JSON rather than using the standardized `{ success, data, error }` response wrapper.
**Root Cause:** The controller circumvented the established pattern using `res.status(...).json(...)`, causing the frontend's global Axios interceptor (which strictly expects the `{ success, data, error }` shape) to resolve `data` as `undefined` and silently drop the response payload.
**Learning:** Enforce that all backend controllers strictly utilize the standardized `success` and `error` wrappers from `utils/response.js` to ensure the frontend global Axios interceptor consistently processes payloads without silent failures.
