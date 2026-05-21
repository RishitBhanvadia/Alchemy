## 2024-05-21 - Fix CursorFollower Hooks Rule Violation
**Bug:** App crashed during build because `CursorFollower.jsx` incorrectly duplicated `useState` calls and violated the Rules of Hooks by placing an early return before the hooks.
**Root Cause:** A bad merge left duplicate hook definitions in place, and placed `if (isTouchDevice) return null;` at the top of the component body, preventing hooks from executing on touch devices.
**Learning:** Always ensure all React hooks (`useState`, `useEffect`) execute in the same order on every render. Use conditional logic *inside* the `useEffect` body or place early UI returns just before the component return statement, never before the hooks.
## 2024-05-21 - Fix CI Build Failures
**Bug:** CI checks failed due to outdated Node.js versions in GitHub Actions (causing dependency errors) and strict `jsx-a11y` & unused variable linting rules breaking the build.
**Root Cause:** The project configured `node-version: 18` which fails with Tailwind dependencies in newer GitHub runners. Additionally, dummy anchor tags, abstract ARIA roles, and non-interactive `onClick` handlers triggered strict linter failures during the build step.
**Learning:** Always keep GitHub Actions Node.js versions up-to-date (e.g., v20+) to avoid obscure optional-dependency build failures. For accessible React applications, replace empty `href="#"` links with semantic `<button>` elements, ensure interactive elements use correct roles (e.g., `role="button"` or `role="dialog"`), and provide keyboard event listeners for elements that handle clicks.
