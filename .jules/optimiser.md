## 2024-05-18 - Lazy Loading Heavy Dashboard Components
**Bottleneck:** High initial bundle size due to large charting libraries (Recharts) and complex table rendering components being loaded synchronously on the Teacher Dashboard.
**Impact:** Reduced Teacher Dashboard chunk size and improved initial parsing time.
**Learning:** Using React.lazy with Suspense effectively splits out heavy components like StudentAnalyticsChart and ClassroomManager, delaying their parsing until needed.
