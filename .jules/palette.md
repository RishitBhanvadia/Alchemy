## 2024-05-18 - Missing Confirmation for Destructive Actions
**Learning:** Found a potentially dangerous interaction in `ClassroomDetail.jsx` where clicking a trash icon immediately deletes an assignment without any confirmation dialog, and the icon lacks screen reader accessibility labels.
**Action:** Added `window.confirm` to intercept the deletion, and added `aria-label` and `title` to the icon-only button to ensure screen readers and mouse hover users understand its function before clicking.

## 2024-05-20 - ESLint JSX-A11y Failures and CI Hanging
**Learning:** Discovered that ESLint strict `jsx-a11y/anchor-is-valid` and `jsx-a11y/aria-role` rules fail builds in strict environments when using dummy `href="#"` links or passing a string prop named `role` (like "student" or "teacher") to custom React components that eventually wrap a `div`. Additionally, the CI Express server startup check (`node -e "require('./server.js')"`) hung indefinitely in GitHub Actions.
**Action:** Replaced dummy anchors with visually-identical `<button type="button">` elements. Renamed custom `role` props to `userRole` to prevent ARIA-role collision. Added `setTimeout(() => process.exit(0), 1000)` to the CI server startup check.
