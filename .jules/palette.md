
## 2024-05-17 - Fix ARIA role conflicts and keyboard accessibility in custom form components
**Learning:** React components that take a user's literal "role" (like "student" or "teacher") as a prop should be named something like `userRole`. Naming the prop `role` conflicts with HTML/ARIA attributes and fails the `jsx-a11y/aria-role` lint check when passed to underlying elements. Custom interactive elements like framer-motion divs also need `role="button"`, `tabIndex={0}`, and keyboard handlers (`onKeyDown` for Space/Enter) to be accessible to keyboard navigation in forms.
**Action:** Always verify custom components functioning as buttons or selectors have full keyboard support and don't reuse reserved HTML attributes for custom props.
