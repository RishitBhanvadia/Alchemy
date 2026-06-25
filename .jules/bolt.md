## 2026-06-25 - Prevent N+1 Query Bottleneck in Supabase
**Learning:** Performing Supabase queries inside .map loops for multiple parent entities (like classrooms) creates an N+1 query bottleneck. Also, Supabase/PostgREST silently truncates records at its default maximum limit of 1000 rows.
**Action:** Extract all unique IDs and perform a single batched query using .in('column', allIds) with .limit(5000). Include the reference ID in .select() to properly map batched results back to their parent entities in memory.
