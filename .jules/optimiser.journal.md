## 2026-04-05 - Lazy Loading Heavy Charting Libraries
**Bottleneck:** Heavy visualization components like Recharts imported synchronously block the main thread and inflate initial JavaScript bundle size.
**Impact:** Reduced initial bundle size and faster Time to Interactive for TeacherDashboard.
**Learning:** Always use React.lazy() and <Suspense> for components that rely on heavy third-party libraries (like recharts) to ensure they are only loaded when needed, keeping the main bundle lean.
