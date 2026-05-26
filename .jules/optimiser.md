## 2024-05-26 - Lazy Load StudentAnalyticsChart
**Bottleneck:** The `TeacherDashboard` loaded the heavy `StudentAnalyticsChart` (which depends on `recharts`) synchronously, making the initial bundle size for the TeacherDashboard significantly larger and slowing down initial load time for teachers.
**Impact:** `TeacherDashboard` bundle chunk size reduced from ~432KB to ~80KB, with the `StudentAnalyticsChart` now decoupled into its own chunk (~362KB). This speeds up the perceived load of the TeacherDashboard page significantly.
**Learning:** Heavy visualization libraries like `recharts` used in specific tab components or lower parts of a dashboard should be lazy-loaded using `React.lazy` and `<Suspense>` to keep the main route's initial load fast.
