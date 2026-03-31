## 2024-05-19 - Standardized Empty States
**Problem:** Several components (ClassroomDetail, Lab3D, StudentDashboard, TeacherDashboard) used unstyled text to display empty states (e.g., "No students found"), leading to a jarring experience.
**Context:** For an educational app where users might start without any data, a polished empty state provides better guidance and improves trust. Unstyled text often gets lost in the UI.
**Solution:** Replaced custom text-based empty states with the existing reusable `EmptyState` component. This standardizes the appearance of empty lists/tables and matches the app's design system.
