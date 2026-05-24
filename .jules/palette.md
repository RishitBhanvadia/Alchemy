## 2024-05-24 - Custom Radio Component Accessibility
**Learning:** When building visually custom radio groups (like the RoleSelector/RoleCard UI), passing `role` as a component prop conflicts with the standard HTML `role` attribute, causing `jsx-a11y/aria-role` lint errors.
**Action:** Always name custom role props distinctly (e.g., `userRole`) and explicitly apply standard ARIA roles (`radiogroup` on the parent container, `radio` and `aria-checked` on children) along with `tabIndex={0}` and `onKeyDown` handlers for keyboard support.
