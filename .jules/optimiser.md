## 2025-02-14 - Lazy Load Heavy Recharts Dependency in TeacherDashboard

**Bottleneck:** The `TeacherDashboard` component was synchronously importing the `StudentAnalyticsChart`, which internally brought in the heavy `recharts` library (and some internal chunks), increasing the initial bundle size for the TeacherDashboard dramatically (nearly 450 KB uncompressed before gzip for just the dashboard chunk).

**Impact:** By lazy-loading the `StudentAnalyticsChart` with `React.lazy()` and `Suspense`, the `TeacherDashboard` chunk size dropped from ~442 KB down to ~80 KB (saving ~360 KB uncompressed, ~107 KB gzipped) on the critical load path for the dashboard. The chart is now split into its own chunk, loaded only when the dashboard renders the chart.

**Learning:** Sync imports of heavy chart libraries like Recharts in high-level components lead to large initial chunks. Lazy loading components that use these libraries is a simple and extremely effective pattern for reducing initial load times in React applications.
