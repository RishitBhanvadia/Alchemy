## 2026-06-26 - Export Student Analytics Data
**Market Insight:** All top tools in this space (e.g. PraxiLabs) support comprehensive reporting and CSV/PDF export of student lab results for teachers to track performance.
**Codebase Match:** Our frontend already pulls classroom progress data and renders it in a data grid within `TeacherDashboard.jsx` using `@tanstack/react-table`, but there is no export functionality.
**Opportunity:** Add an ExportButton component to the TeacherDashboard that maps the existing table data to CSV — a low effort, high impact table-stakes feature for educators.
