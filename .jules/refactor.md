## 2026-06-23 - Fix duplicate state and Rules of Hooks violation in CursorFollower
**Before:** Duplicate state declarations (`clicking`, `hovering`) causing parsing errors. Early return (`if (isTouchDevice) return null;`) executed before a `useEffect` hook, which violates React's Rules of Hooks.
**Issue:** ESLint parsed duplicate identifiers causing build failures. Early return before hooks causes inconsistent hook call orders depending on the device type.
**Learning:** Fixing basic parsing errors in React components is critical for build stability. Additionally, always ensure that all React hooks are called unconditionally at the top level of the component before any early returns to prevent runtime inconsistencies.

## 2026-06-23 - Fix accessibility rules and clean up unused imports in Auth Module
**Before:** `AuthPage.jsx` and `LoginForm.jsx` used anchor tags with `href="#"` for links. `RoleCard.jsx` exposed a `role` prop causing `jsx-a11y/aria-role` errors. Several components had unused imports.
**Issue:** ESLint failed the CI build due to these strict `jsx-a11y` and `no-unused-vars` rules.
**Learning:** For accessibility compliance in React, avoid using anchor tags without valid hrefs; substitute them with styled `button` tags. Avoid using HTML attributes like `role` as prop names to prevent linter confusion. Removing unused imports is critical for strict ESLint configurations.


## 2026-06-23 - Fix accessibility on modal backgrounds
**Before:** `CreateClassModal.jsx` had div overlays serving as click dismissals that triggered `jsx-a11y/click-events-have-key-events` and `jsx-a11y/no-static-element-interactions` ESLint warnings.
**Issue:** Attaching onClick to a standard div suggests an interactive element to screen readers but lacks keyboard controls, failing accessibility checks that block the CI.
**Learning:** For modal backdrops or overlays where an onClick is used merely to close the modal (and not as a semantic button), adding `role="presentation"` satisfies the a11y linter rules, clarifying that the element is not meant for user interaction.

## 2026-06-23 - Add explicit PropTypes to resolve ESLint validation warnings
**Before:** `EmptyState.jsx` defined multiple props (`icon`, `title`, `description`, etc.) without declaring a `propTypes` object, triggering `react/prop-types` ESLint warnings.
**Issue:** Strict CI pipelines utilizing `eslint-plugin-react` will fail if `react/prop-types` warnings are emitted and treated as errors (or cause the build to halt due to high warning counts).
**Learning:** For React components lacking TypeScript interfaces, it is critical to explicitly import `PropTypes` from the `prop-types` package and define validation for all component properties to maintain strict linting compliance and ensure robust type checking during development.
