## 2025-04-12 - Fix N+1 queries in teacher analytics
**Before:** `getAnalytics` used a `Promise.all` loop to make individual database queries for `experiment_results` for every single classroom a teacher had, triggering an N+1 query bottleneck.
**Issue:** Making DB queries in loops doesn't scale well and causes significant performance overhead for teachers with many classrooms.
**Learning:** Extract IDs across all entities first, execute a single batch `.in()` query, then locally map/filter the bulk data to greatly improve endpoint performance.
