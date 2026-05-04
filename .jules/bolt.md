## 2024-05-24 - N+1 Queries in Supabase
**Learning:** Making separate Supabase queries inside `Promise.all` loops creates N+1 query performance bottlenecks.
**Action:** Consolidate N+1 queries into a single `.in()` filter for all IDs, and perform grouping/filtering in memory instead.
