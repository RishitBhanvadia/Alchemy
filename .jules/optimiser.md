## 2024-05-18 - CursorFollower Duplicate State Fix
**Bottleneck:** Duplicate state declaration was preventing the build from compiling.
**Impact:** Unblocked the application build.
**Learning:** React duplicate state bindings cause Vite/Esbuild to error during compilation.
## 2024-05-18 - Lazy load heavy Chart component
**Bottleneck:** `TeacherDashboard` directly imports `StudentAnalyticsChart` which imports `recharts`. `recharts` is a large library that blocks initial render.
**Impact:** Reduced initial bundle size for TeacherDashboard. `recharts` only loads when required.
**Learning:** Heavy charting libraries should be lazily loaded to avoid blocking the main thread during initial render.
