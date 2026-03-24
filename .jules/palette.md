## 2024-03-12 - ARIA Labels for Icon-Only Navigation
**Learning:** Icon-only buttons (like those using FontAwesome in a sidebar navigation) are entirely invisible to screen readers without descriptive text.
**Action:** Always ensure interactive icon-only elements (`<button>`, `<a>`, `<NavLink>`) have explicit `aria-label` attributes to describe their destination or function.
