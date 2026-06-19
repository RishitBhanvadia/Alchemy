## 2025-06-19 - Avoid Custom Prop Names That Collide with HTML Attributes
**Before:** `role="student"` was passed as a prop to `<RoleCard>`, which bled into the DOM triggering an invalid ARIA role warning.
**Issue:** HTML attribute collisions can cause unexpected browser accessibility issues when spread onto underlying DOM nodes.
**Learning:** Always rename custom component props (e.g. `userRole`) if they might inadvertently collide with standard HTML attributes (like `role`, `className`, or `id`).
