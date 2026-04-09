## 2025-02-14 - Fix aria-role warning in RoleCard components
**Before:** The `RoleCard` component used a prop named `role` which was passed down from `SignUpForm`. This caused ESLint to flag it with `Elements with ARIA roles must use a valid, non-abstract ARIA role` because `role` is an HTML attribute reserved for ARIA roles, and setting it to "student" or "teacher" is invalid.
**Issue:** The prop name `role` conflicted with the HTML `role` attribute, causing ESLint accessibility warnings (`jsx-a11y/aria-role`).
**Learning:** Renaming the custom prop to `roleType` instead of `role` avoids the conflict with the standard HTML `role` attribute and resolves the ESLint warning while maintaining clarity.
