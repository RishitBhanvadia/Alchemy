## 2025-04-08 - Fixed React State Leak in useFrame
**Bottleneck:** High CPU usage and frame drops in React Three Fiber scenes.
**Impact:** 60fps stable, prevented infinite re-renders.
**Learning:** Never put React setState inside R3F's useFrame (runs 60x per second).
## 2025-04-08 - Lazy Load Heavy Chart Component
**Bottleneck:** High initial load bundle size in TeacherDashboard due to `StudentAnalyticsChart` (which imports `recharts`) being included in the main dashboard bundle.
**Impact:** Reduced `TeacherDashboard` chunk size from ~444.15 kB to ~79.89 kB, moving the heavy chart to its own chunk `StudentAnalyticsChart-*.js` (~364.60 kB) loaded on demand.
**Learning:** Always lazy load heavy charting libraries in dashboards unless they are immediately critical above-the-fold, as they drastically bloat initial JS parsing times.
