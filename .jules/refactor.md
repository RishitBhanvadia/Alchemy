## 2024-03-29 - Consolidated secure code generation logic
**Before:** There were duplicated logic across client (classroomStore) and server (classroomController, meetingController) files generating alphanumeric string codes using `Math.random()`.
**Issue:** `Math.random()` is not secure for generating codes, leading to a possible security risk. The logic was also duplicated resulting in poor maintainability.
**Learning:** Extracting common code generation patterns to utilities allows upgrading algorithms centrally. By switching to Node's `crypto.randomInt` and the browser's `window.crypto.getRandomValues`, we easily achieved security across both environments while completely eliminating the duplicated logic scattered in business layer services/controllers.

## 2024-03-29 - Fixed ERR_REQUIRE_ESM error in vitest
**Before:** Running vitest on Node 18 caused ERR_REQUIRE_ESM because `inline` property in `vite.config.js` was using string literals for `['@exodus/bytes', 'html-encoding-sniffer']`
**Issue:** CJS/ESM mixed imports can cause ESM required errors in Node environments for modules running via vitest.
**Learning:** For dependencies requiring ESM resolution like `@exodus/bytes` and `html-encoding-sniffer` in Vitest inline configs, you must use regular expressions (`/@exodus\/bytes/, /html-encoding-sniffer/`) instead of string literals.
