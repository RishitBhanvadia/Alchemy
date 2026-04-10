## 2025-01-31 - [Initial Review]
## 2025-01-31 - Use EmptyState for empty lists

**Problem:** Empty lists across the application (like 'No assignments', 'No students enrolled', 'No experiments run') use hardcoded inline text or table rows, which lack visual hierarchy, look plain, and are inconsistent with the established `EmptyState` component.
**Context:** For this app, providing clear, attractive, and consistent empty states helps guide users (students and teachers) on what to do next or simply offers better visual polish, rather than showing raw text like 'No assignments yet! Enjoy the sandbox. 🧪'.
**Solution:** Refactor various 'empty list' views in `StudentDashboard`, `ClassroomDetail`, `Lab3D`, and `TeacherDashboard` to utilize the shared `EmptyState` component, ensuring a unified design system and improved user experience.
