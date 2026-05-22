## 2024-05-22 - Lazy Load TeacherDashboard Chart
**Bottleneck:** The heavy `recharts` library was bundled directly into `TeacherDashboard`, causing a large initial chunk size.
**Impact:** `TeacherDashboard` chunk size was significantly reduced.
**Learning:** Recharts is a heavy dependency that should always be dynamically imported using React.lazy to prevent blocking the main thread when rendering routes that don't immediately display the chart.
