## 2024-03-17 - Lazy Loading Heavy Chart Libraries
**Bottleneck:** The `TeacherDashboard` component statically imported `StudentAnalyticsChart`, which in turn imported `recharts`. This forced the entire `recharts` library into the main `TeacherDashboard` chunk.
**Impact:** Reduced the `TeacherDashboard` chunk size significantly by splitting `recharts` and the chart component into a separate chunk.
**Learning:** Always use `React.lazy()` for components that wrap heavy third-party libraries (like data visualization/charts), especially when they aren't the primary immediate focus of the route. This isolates the heavy library to its own chunk that is only loaded when needed.
