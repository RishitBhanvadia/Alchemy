## 2024-05-24 - Accessibility for Icon-Only Navigation Buttons
**Learning:** Icon-only navigation buttons in the sidebar (`client/src/components/sidebar.jsx`) lack accessible names, making them difficult to understand for screen reader users and non-obvious for sighted users when hovering.
**Action:** Consistently add both `aria-label` (for screen readers) and `title` (for native browser tooltips) to all icon-only buttons to ensure full accessibility and a clear user experience.
