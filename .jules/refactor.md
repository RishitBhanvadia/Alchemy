## 2024-03-29 - Consolidated secure code generation logic
**Before:** There were duplicated logic across client (classroomStore) and server (classroomController, meetingController) files generating alphanumeric string codes using `Math.random()`.
**Issue:** `Math.random()` is not secure for generating codes, leading to a possible security risk. The logic was also duplicated resulting in poor maintainability.
**Learning:** Extracting common code generation patterns to utilities allows upgrading algorithms centrally. By switching to Node's `crypto.randomInt` and the browser's `window.crypto.getRandomValues`, we easily achieved security across both environments while completely eliminating the duplicated logic scattered in business layer services/controllers.
