## 2024-05-04 - Consolidate N+1 Queries in Teacher Analytics
**Learning:** Making separate Supabase queries inside `Promise.all` across multiple classrooms creates an N+1 bottleneck, severely increasing latency as the number of classrooms scales.
**Action:** Combine all student IDs across all classrooms into a single set, fetch all their logs with one `.in()` query, and then group the results in-memory.
