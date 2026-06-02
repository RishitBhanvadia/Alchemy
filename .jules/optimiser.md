2024-06-02 - Lazy Load TeacherDashboard Chart
**Bottleneck:** The `TeacherDashboard` component was importing `StudentAnalyticsChart` statically, which included the heavy `recharts` library directly in the dashboard's initial chunk (~442KB gzip uncompressed).
**Impact:** Initial dashboard chunk size was reduced to ~80KB. The `recharts` library is now code-split and only loaded when needed.
**Learning:** React's `lazy` and `Suspense` are highly effective at decoupling heavy dependencies (like charting libraries) from main route chunks, particularly for components that aren't immediately visible above the fold.
