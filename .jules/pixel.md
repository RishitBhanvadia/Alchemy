## 2024-05-30 - Fix RoleCard Accessibility Issues

**Problem:** The `RoleCard` component used during sign-up for selecting user roles (`student` or `teacher`) is styled as a custom card layout rather than a native HTML input. It acts as a set of options but relies entirely on `onClick`, meaning users relying on keyboard navigation (Tab and Enter) or screen readers cannot access or interact with it properly.

**Context:** The sign-up form is a critical user flow for this app, as it's the entry point to access the virtual lab. The existing implementation creates friction for users depending on keyboard or assistive technologies, directly failing the "Accessibility is non-negotiable" standard for this project.

**Solution:** Added appropriate ARIA roles and tab indices to the `RoleCard` and its container inside `SignUpForm.jsx`. Specifically, the container is given `role="radiogroup"`, while the individual `RoleCard` items are given `role="radio"`, `aria-checked`, `tabIndex={0}`, and an `onKeyDown` handler to support selection using the 'Enter' and 'Space' keys. This aligns with accessibility best practices without changing the app's visual style.
