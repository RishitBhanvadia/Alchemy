## 2024-05-01 - Heavy Analytics Component Lazy Loading
**Learning:** The `StudentAnalyticsChart` component uses `recharts` which is a heavy library. It's imported synchronously in `TeacherDashboard.jsx`, which blocks the initial load of the dashboard.
**Action:** Use `React.lazy` to lazy load `StudentAnalyticsChart` and wrap it in a `<Suspense>` boundary in `TeacherDashboard.jsx`.
