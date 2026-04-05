## 2025-02-23 - Comprehensive CI Pipeline Fixes
**Bug:** Multiple distinct bugs were causing repeated failures across various GitHub CI workflows (build-client, build-server, and test jobs).
**Root Cause:**
1. The GitHub CI workflows (`ci.yml`, `build-check.yml`, `deploy-check.yml`) were using Node 18, but `@tailwindcss/oxide` requires Node 20+, leading to missing native bindings and failing builds.
2. The Express server in `server.js` was automatically listening on its port when `require`d by tests, blocking the event loop and causing the test job to time out after 6 hours.
3. ESLint accessibility validation failed because placeholders (`<a href="#">`) were incorrectly used instead of `<button>` tags, and the custom `<RoleCard>` component accepted an improper prop name `role` which conflicted with standard ARIA roles.
4. Input components lacked a proper `htmlFor` association, causing a regression in accessibility tests.
**Learning:**
- Always ensure CI workflows' node versions match current dependencies' minimum bounds (Node 20+).
- Never unconditionally run `app.listen()` directly on module load; wrap it in `if (require.main === module)` to allow clean imports in test environments.
- Use explicit non-HTML-standard names (like `roleType`) for custom React props instead of standard DOM attributes (like `role`). Use `<button type="button">` instead of empty `<a href="#">` links.
- Always include the `htmlFor` attribute linking `<label>` elements to input IDs.
