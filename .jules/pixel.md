## 2025-02-28 - Double-Focus and Missing Labels in Sidebar Navigation
**Problem:** Screen readers encountered double-focus issues with nested `<button>` elements and lacked context due to missing labels for main navigation links like Lab, Titration, etc.
**Context:** In the Alchemistry application sidebar, `<NavLink>` items wrap nested `<button>` elements holding an icon. This led to ambiguous navigation actions and confusing screen-reader experiences.
**Solution:** Applied `tabIndex={-1}` to the nested `<button>` elements to remove them from the tab sequence and added descriptive `aria-label` attributes directly onto the parent `<NavLink>` to give clear context.
