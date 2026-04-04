## 2026-04-04 - Lazy loading StudentAnalyticsChart
**Bottleneck:** The Recharts library is massive and was being included in the main bundle due to a static import in `TeacherDashboard.jsx`, slowing down the initial load.
**Impact:** Moves over 360 KB out of the main bundle into its own chunk (`StudentAnalyticsChart-BsF-mgiE.js`), reducing initial load size and parsing time.
**Learning:** Heavy visualization components and their dependencies (like Recharts) should always be lazily loaded (`React.lazy`) when they render below the fold or on secondary tabs, preventing them from blocking the initial page render.
