## 2025-02-23 - Fix ARIA role prop pollution in React components
**Before:** Custom components like `RoleCard` used the prop name `role` to indicate user roles (e.g. "student", "teacher").
**Issue:** When the `role` prop was inadvertently spread or attached to HTML elements via React, it caused ESLint `jsx-a11y/aria-role` errors and violated ARIA accessibility standards.
**Learning:** In React components, avoid naming props `role` when they are meant for business logic. Renaming these custom props to `roleType` prevents accidental ARIA violations and immediately resolves `jsx-a11y/aria-role` linting errors.
