## 2024-05-24 - Navigation Component Double-Focus
**Learning:** Screen readers and keyboard navigation can experience double-focus issues when interactive elements like `<button>` are nested inside other interactive elements like `<NavLink>`.
**Action:** Always apply `tabIndex={-1}` to nested interactive elements (like `<button>`) inside navigation links and ensure the parent link has a descriptive `aria-label`.
