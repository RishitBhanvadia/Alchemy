## 2024-03-05 - Add ARIA Labels to Sidebar Icon Buttons

**Learning:** FontAwesome icons used as buttons without descriptive text create significant barriers for screen reader users, who will just hear "button" without context.
**Action:** Always verify that icon-only interactive elements (like in `sidebar.jsx` or directional arrows in `titration.jsx`) have explicitly set `aria-label` attributes and the icons themselves have `aria-hidden="true"` to prevent redundant reading.