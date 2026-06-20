## 2024-06-19 - Accessible icon-only buttons
**Learning:** Icon-only buttons (like the FontAwesome icons in the sidebar navigation or emoji buttons in Lab3D) often lack visible text, making them completely inaccessible to screen reader users because they don't have an accessible name.
**Action:** Always add an `aria-label` to icon-only buttons (`<button aria-label="Action Name"><i class="fa fa-icon"></i></button>`). Also, replace invalid empty anchor tags (`href="#"`) with semantic `<button type="button">` elements styled as links.
