## 2025-04-26 - [Linting Errors Overview]
**Bug:** Several linting errors regarding `jsx-a11y/anchor-is-valid` and `jsx-a11y/aria-role`
**Root Cause:** Missing or invalid attributes for `<a>` tags acting as buttons, and incorrect assignment of arbitrary strings to `role` attributes in ARIA-enabled components.
**Learning:** For anchor elements without a real `href`, switch to buttons, or use `e.preventDefault()`. In JSX-A11Y, don't use the name `role` for application-specific string props (like user roles), use a different name like `roleType` or just disable the rule for custom prop usages.
