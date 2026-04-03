## 2024-05-24 - Code Splitting Recharts in Dashboard
**Learning:** Recharts is a large dependency that inflates the initial JS bundle size when imported synchronously in the TeacherDashboard.
**Action:** Always use `React.lazy()` and `<Suspense>` to code-split heavy visualization components (like `StudentAnalyticsChart`). When doing so, avoid referencing bottom-defined `styles` objects in the Suspense fallback to prevent ReferenceErrors during initial load.
