## 2024-05-07 - Fix layout breaking due to "max-max-width" typo
**Problem:** The layout of multiple pages (StudentDashboard, Lab3D, TeacherDashboard, AuthPage, etc.) was broken because of a pervasive typo in CSS files where `max-width` was written as `max-max-width`, causing the property to be ignored by browsers and breaking mobile layouts.
**Context:** This was a global issue affecting the basic layout structure and responsiveness across the entire app. It affected the core flow of logging in, using dashboards, and conducting experiments.
**Solution:** Replaced all instances of `max-max-width` with `max-width` across 14 CSS files in the repository.
