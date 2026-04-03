## 2025-02-18 - Lazy Load Heavy Chart Component
**Bottleneck:** Eagerly loading `StudentAnalyticsChart.jsx` (which heavily relies on the `recharts` library) in `TeacherDashboard.jsx` increases the initial JavaScript bundle size significantly and can block the main thread.
**Impact:** Using `React.lazy` and `Suspense` allows separating the heavy dependency (`recharts`) into its own chunk, making the dashboard load faster.
**Learning:** For heavy visualization components that rely on large external dependencies (like `recharts`), we must lazy load them via `React.lazy()` to defer execution, prevent blocking the main thread, and reduce the initial load times.
