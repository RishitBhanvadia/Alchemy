## 2025-02-28 - Renaming conflicting `role` props to prevent accessibility errors
**Before:** Custom React components like `RoleCard` and `SignUpForm` were using `role` as a prop name (e.g., `<RoleCard role="student" />`).
**Issue:** ESLint's `jsx-a11y/aria-role` rule flags custom `role` props on React components if the prop is inadvertently passed down to underlying HTML elements, or because it creates ambiguity with the standard HTML `role` attribute, causing CI to fail with "Elements with ARIA roles must use a valid, non-abstract ARIA role".
**Learning:** Always use domain-specific prop names like `userRole` instead of `role` in React components to avoid colliding with HTML ARIA attributes and causing accessibility lint errors.
