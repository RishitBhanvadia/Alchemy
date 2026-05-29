## 2024-05-28 - Lazy Load Heavy Chart Component
**Bottleneck:** Recharts library was imported directly in `TeacherDashboard.jsx`, causing a ~362KB uncompressed addition to the chunk.
**Impact:** `TeacherDashboard` bundle size was reduced from ~442KB to ~80KB, saving ~362KB of uncompressed JavaScript from being eagerly loaded.
**Learning:** Recharts is a heavy dependency. Always lazy load charting components like `StudentAnalyticsChart` with `React.lazy` and `Suspense` when they are used in non-critical rendering paths or inside tabs/dashboards.
