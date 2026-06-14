## 2023-10-24 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** Icon-only buttons (like the `sidebar.jsx` navigation icons using FontAwesome `<i>` tags) lack accessible names by default, making them completely opaque to screen readers. Relying solely on visual cues (icons) without text equivalents violates WCAG guidelines.
**Action:** Always ensure that icon-only interactive elements (like `<button>` or `<a>`) have a descriptive `aria-label` attribute (or a screen-reader-only text span). Including a `title` attribute is also beneficial for sighted users as a tooltip.
