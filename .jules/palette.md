## 2024-04-08 - Added ARIA labels to Sidebar buttons
**Learning:** Found that navigation sidebar buttons (`client/src/components/sidebar.jsx`) only used Font Awesome icons (`<i className="fa-solid..."></i>`) without any accessible names, making them inaccessible to screen readers.
**Action:** Always verify that icon-only buttons have an `aria-label` attribute providing clear context for the action, especially in core navigation components.
