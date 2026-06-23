## 2026-06-23 - Fix duplicate state and Rules of Hooks violation in CursorFollower
**Before:** Duplicate state declarations (`clicking`, `hovering`) causing parsing errors. Early return (`if (isTouchDevice) return null;`) executed before a `useEffect` hook, which violates React's Rules of Hooks.
**Issue:** ESLint parsed duplicate identifiers causing build failures. Early return before hooks causes inconsistent hook call orders depending on the device type.
**Learning:** Fixing basic parsing errors in React components is critical for build stability. Additionally, always ensure that all React hooks are called unconditionally at the top level of the component before any early returns to prevent runtime inconsistencies.

## 2026-06-23 - Fix accessibility rules and clean up unused imports in Auth Module
**Before:** `AuthPage.jsx` and `LoginForm.jsx` used anchor tags with `href="#"` for links. `RoleCard.jsx` exposed a `role` prop causing `jsx-a11y/aria-role` errors. Several components had unused imports.
**Issue:** ESLint failed the CI build due to these strict `jsx-a11y` and `no-unused-vars` rules.
**Learning:** For accessibility compliance in React, avoid using anchor tags without valid hrefs; substitute them with styled `button` tags. Avoid using HTML attributes like `role` as prop names to prevent linter confusion. Removing unused imports is critical for strict ESLint configurations.
