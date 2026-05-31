## 2026-05-31 - Lazy Load Recharts Components
**Bottleneck:** Heavy charting library (Recharts) included in initial bundle.
**Impact:** Reduced initial JS bundle size by lazily loading components not in critical rendering path.
**Learning:** In the Alchemistry project, always lazy load heavy charting components (like StudentAnalyticsChart) using React.lazy and Suspense to improve initial load performance.
