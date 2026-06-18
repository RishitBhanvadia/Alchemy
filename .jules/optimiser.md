## 2024-05-20 - Lazy load Recharts in TeacherDashboard
**Bottleneck:** Recharts library (via StudentAnalyticsChart) statically imported, causing massive TeacherDashboard chunk size (~425KB).
**Impact:** Reduced TeacherDashboard bundle size from ~425KB to ~80KB by code-splitting the chart.
**Learning:** Heavy charting libraries like Recharts should always be lazy-loaded using React.lazy and Suspense to prevent blocking the main thread during route navigation.
