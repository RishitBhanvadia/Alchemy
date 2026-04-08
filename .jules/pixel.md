## 2024-05-15 - Improving Empty States in Teacher Dashboards

**Problem:** Empty states in data tables (Student Roster and Assignments) in `TeacherDashboard.jsx` and `ClassroomDetail.jsx` were unstyled, inconsistent, and often appeared as plain text or blank rows. This lacked visual hierarchy and clear feedback.

**Context:** The Teacher persona needs clear feedback when data is missing. A plain "No assignments created yet" row in a table looks like an error or incomplete UI. Consistent empty states reassure the user that the system is working but data is simply absent.

**Solution:** I replaced the plain text fallbacks and empty table rows with the existing, styled `EmptyState` component (`components/EmptyState.jsx`). This provides a clear icon, title, description, and, crucially, an actionable button (like "+ New Assignment") when appropriate, guiding the user on what to do next. This maintains visual consistency with the rest of the application's empty states (like the History log).
