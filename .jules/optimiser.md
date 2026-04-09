## 2024-05-24 - Lazy Load Heavy Chart in TeacherDashboard
**Bottleneck:** The `TeacherDashboard` bundled `StudentAnalyticsChart` (and `recharts`), increasing the initial chunk size by over 100kB (gzipped).
**Impact:** Separated `recharts` into a separate chunk, reducing the `TeacherDashboard` bundle size.
**Learning:** Heavy charting libraries (like `recharts`) in dashboard components should be lazy-loaded since they often appear below the fold or are conditionally rendered, avoiding bloated initial bundle sizes.
