## 2025-02-14 - Fix ESLint ARIA role and unused imports
**Bug:** CI failing due to `jsx-a11y/aria-role` on custom components and unused variables.
**Root Cause:** Custom component prop named `role` conflicted with native ARIA `role` attribute, and strict ESLint configuration failed CI on unused imports.
**Learning:** When passing user roles (e.g., student/teacher) as props to components, always name the prop `userRole` rather than `role` to prevent `jsx-a11y/aria-role` linting errors. Also, always clean up unused imports from UI components.
