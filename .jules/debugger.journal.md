## 2025-04-08 - Fixed React ARIA Role Linting Errors in SignUpForm
**Bug:** Build was failing or showing errors related to `jsx-a11y/aria-role` because the `RoleCard` component prop named `role` was conflicting with the standard HTML ARIA `role` attribute.
**Root Cause:** Using `role` as a prop name for custom React components triggers the `jsx-a11y/aria-role` ESLint rule, as linters may interpret it as a potentially invalid HTML ARIA attribute.
**Learning:** Never name custom props `role` when building components, instead use names like `roleType` to avoid collision with standard ARIA attributes and pass ESLint accessibility checks.
