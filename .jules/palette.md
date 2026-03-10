## 2024-05-24 - Double Focus on NavLink Buttons
**Learning:** React Router's `<NavLink>` renders an `<a>` element. Placing a `<button>` directly inside it causes screen readers and keyboard navigation to register two focusable interactive elements per item, leading to a frustrating "double-focus" experience.
**Action:** For navigational items that must visually behave like buttons inside a link, ensure keyboard focus only hits the parent `<NavLink>` by adding `aria-label` to the parent and applying `tabIndex={-1}` to the nested `<button>`.
