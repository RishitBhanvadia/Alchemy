## 2024-05-23 - Lazy load Recharts to minimize bundle size
**Before:** `recharts` was statically imported in components like `StudentAnalyticsChart.jsx` and `TeacherDashboard.jsx`, which increased the initial bundle size because it's a heavy dependency.
**Issue:** Large bundle size due to heavy dependency loaded upfront.
**Learning:** Components utilizing heavy dependencies like `recharts` (e.g. analytics charts) should be dynamically imported using `React.lazy()` and wrapped in a `<Suspense>` boundary rather than statically imported to minimize bundle sizes.
