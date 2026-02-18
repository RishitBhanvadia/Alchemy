## 2025-05-24 - Navigation and Feedback Patterns
**Learning:** Some pages (like Titration) import `Navbar` manually while `App.jsx` also renders it conditionally, leading to duplicate navigation bars.
**Action:** Always check `App.jsx` routing and layout logic before adding layout components to individual pages.

**Learning:** Using a single state variable for both persistent info (score) and transient feedback (saved success) leads to message overriding and poor UX.
**Action:** Use `react-hot-toast` (or similar) for transient success/error messages to keep persistent UI state visible.

**Learning:** Icon-only buttons (like arrows) frequently lack `aria-label`, making them inaccessible.
**Action:** Systematically check all icon buttons for `aria-label` during reviews.
