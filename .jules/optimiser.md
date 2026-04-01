## 2024-04-01 - Lazy load StudentAnalyticsChart in TeacherDashboard
**Bottleneck:** The `TeacherDashboard` component was importing `StudentAnalyticsChart` synchronously, which brought in the heavy `recharts` library and bloated the dashboard's initial load bundle size (432KB minified).
**Impact:** Bundle size of `TeacherDashboard` chunk reduced from 432KB to 80KB (130KB -> 22KB gzipped). Faster initial page load for the teacher dashboard.
**Learning:** Heavy charting libraries should always be lazy-loaded, especially when they are rendered below the fold or inside a specific section of a dashboard, preventing unnecessary parsing and execution on initial route load.
