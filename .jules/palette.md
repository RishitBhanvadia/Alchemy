## 2026-03-11 - Screen-reader Double-focus in Navigation
**Learning:** In navigation components (like `sidebar.jsx`), placing interactive elements (like `<button>`) inside of routing elements (like `<NavLink>`) causes double-focus issues for screen readers.
**Action:** Apply `tabIndex={-1}` to nested `<button>` elements and place the `aria-label` (and `title` for visual tooltips) on the parent `<NavLink>` to provide a single, accessible focus target.
