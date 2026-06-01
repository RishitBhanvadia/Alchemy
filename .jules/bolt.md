## 2025-02-18 - Lazy load heavy charting components
**Learning:** The `recharts` library is a heavy dependency that increases the initial JavaScript bundle size. Components like `StudentAnalyticsChart` that depend on it are not in the critical rendering path for the dashboard.
**Action:** Always lazy load heavy charting components using `React.lazy` and `Suspense` with an appropriate loading fallback (like a Skeleton) to improve the initial load performance of the application.
