## 2024-05-14 - Missing ARIA attributes on icon-only interactive elements
**Learning:** Icon-only interactive elements (like the sidebar buttons using FontAwesome `<i>` tags) lack descriptive labels for screen readers.
**Action:** Always include a descriptive `aria-label` on the parent button and `aria-hidden="true"` on the icon element itself when creating icon-only buttons to provide proper context to screen readers.
