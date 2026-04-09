## 2025-03-09 - Lazy load heavy components
**Learning:** Recharts is a heavy dependency that was slowing down the initial bundle size of TeacherDashboard.jsx.
**Action:** Use `React.lazy()` and `Suspense` with an appropriate fallback UI (matching the existing styling, such as `color: '#666'`) to defer loading heavy visualization libraries until they are needed in the component tree.
