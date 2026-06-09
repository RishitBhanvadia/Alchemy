## 2023-10-27 - EdTech Virtual Lab Standard Features
**Market Insight:** Top virtual chemistry labs (Labster, Gizmos) go beyond simulation to offer comprehensive classroom management, specifically the ability for teachers to export data to integrate with their school's existing gradebooks.
**Codebase Match:** Alchemistry has a `TeacherDashboard.jsx` with a data grid (`@tanstack/react-table`) and analytics, but currently lacks any way to export this data.
**Opportunity:** Adding a CSV export feature to the teacher dashboard is a high-value, low-effort table stakes addition that aligns perfectly with the existing React Table implementation.

## 2023-10-27 - Guided Onboarding in Complex 3D UI
**Market Insight:** Products like Labster use guided onboarding sequences to help users navigate complex 3D environments, preventing user drop-off.
**Codebase Match:** Alchemistry's `Lab3D.jsx` relies on static `.keyboard-instructions` at the bottom of the screen, which is easy to miss.
**Opportunity:** Implementing an interactive, step-by-step tutorial (using local storage to track completion) will significantly improve the first-time user experience in the 3D lab.
