## 2025-02-12 - Resolve ARIA Role Conflict in Custom Components
**Bug:** Using the `role` prop on custom React components (like `<RoleCard role="student" />`) conflicts with native HTML ARIA `role` attributes, causing ESLint `jsx-a11y/aria-role` errors because the values passed (e.g., "student") are not valid ARIA roles.
**Root Cause:** The linter evaluates the `role` prop as if it were applying a standard ARIA role to an HTML element.
**Learning:** In Alchemistry React components, avoid naming custom component props `role` to designate internal types. Instead, rename the prop to an alternative like `roleType` to prevent conflicting with native HTML ARIA roles and triggering accessibility linters.
