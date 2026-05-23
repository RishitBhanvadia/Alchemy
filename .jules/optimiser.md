## 2024-05-23 - Lazy Load Heavy Recharts Dependency
**Bottleneck:** The `TeacherDashboard` component was importing `StudentAnalyticsChart` statically, which included the heavy `recharts` dependency in the initial bundle chunk, making it >130KB gzipped.
**Impact:** Reduced the `TeacherDashboard` bundle chunk size from ~130.18 kB gzipped to ~22.28 kB gzipped. The chart and `recharts` library (~108.71 kB) are now code-split and only loaded when needed.
**Learning:** Components utilizing heavy chart libraries like `recharts` should always be dynamically imported using `React.lazy()` and `<Suspense>` to minimize bundle sizes and improve initial load performance.
