## 2024-05-15 - [Initial setup]
**Learning:** Initial setup for Palette journal.
**Action:** Created the file.
## 2024-05-15 - Role naming conflict with ARIA
**Learning:** When creating React components that take a user role as a prop (e.g. student or teacher), naming the prop `role` conflicts with HTML/ARIA role attributes and triggers `jsx-a11y/aria-role` linting errors.
**Action:** Rename the `role` prop to `userRole` in RoleCard and SignUpForm components.
