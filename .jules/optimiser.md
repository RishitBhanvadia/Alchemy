## 2024-05-20 - Split Recharts into vendor chunk and Lazy load StudentAnalyticsChart
**Bottleneck:** The `TeacherDashboard` chunk size was massive (~444 kB) because it bundled `recharts` directly into its chunk and statically imported the chart component. This delayed the initial rendering of the dashboard.
**Impact:** Reduced the `TeacherDashboard` main chunk from 444 kB down to ~80 kB. The chart component is now lazy-loaded, speeding up the initial load of the dashboard.
**Learning:** For analytical views that use large charting libraries like `recharts`, isolating the library in a manual vendor chunk and lazy loading the specific chart component prevents the library's weight from blocking the dashboard's initial render.
