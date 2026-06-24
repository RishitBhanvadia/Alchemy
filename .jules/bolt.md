## 2024-10-24 - Fix N+1 query in teacher analytics
**Learning:** In the Alchemistry server, pulling relational data from Supabase for multiple parent entities (like classrooms) using `.map` and `Promise.all` causes N+1 query bottlenecks.
**Action:** Extract all unique IDs and perform a single batched query using `.in('column', allIds)` to improve performance.
