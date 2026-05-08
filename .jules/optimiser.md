## 2025-05-08 - Bundle Size Optimization in TeacherDashboard
**Bottleneck:** The `TeacherDashboard` module bundled heavy dependencies like `@tanstack/react-table` and `recharts` tightly, resulting in a 440+ KB chunk `TeacherDashboard-xxx.js`.
**Impact:** The `TeacherDashboard-xxx.js` bundle size decreased significantly (from ~440KB to ~13KB) while shifting `vendor-charts` (~350KB) and `vendor-table` (~50KB) to separate parallelized chunks.
**Learning:** Code-splitting component logic with lazy loading + separating heavy library vendor chunks yields far better file parallelization and smaller individual component files.
