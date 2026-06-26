## 2025-06-26 - Fix React Table Re-render Optimization
**Bottleneck:** useReactTable in TeacherDashboard re-created columns on every render, triggering ESLint warnings and poor performance.
**Impact:** Memoized columns definitions, preventing unnecessary re-calculations on state updates like sorting and filtering.
**Learning:** React Table API hooks like `useReactTable` require all dynamic references (data, columns) to be strictly memoized using `useMemo` to ensure stable UI and avoid the `react-hooks/incompatible-library` ESLint error.
