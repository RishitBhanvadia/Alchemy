## 2026-06-12 - Fix React List Items Re-Rendering Pattern
**Bottleneck:** Rendering long lists in `history.jsx` and re-computing static objects like `columns` config in `TeacherDashboard.jsx` unnecessarily degraded frame times. Defining `React.memo` components *inside* a parent component effectively nullifies the optimization as a new reference is created on every render, causing the children to entirely re-mount.
**Impact:** Avoids total re-mounting of all children on each render and reduces DOM reconciliation time.
**Learning:** Always define `React.memo()` wrapper components outside the parent component file to prevent reference changes across parent re-renders. Use `useMemo` for React Table column definitions.
