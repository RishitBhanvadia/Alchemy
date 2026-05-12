## 2024-05-12 - Fix N+1 Query in Teacher Analytics
**Bottleneck:** In `server/controllers/teacherController.js` inside `getAnalytics`, `await Promise.all` executes an N+1 query: for each classroom, it fetches experiment logs via `supabase.from("experiment_results").select(...).in("user_id", studentIds)`. This creates N separate DB queries per classroom.
**Impact:** Significantly improves backend response time for `getAnalytics` by batching logs queries into a single call.
**Learning:** Consolidating repeated `.in()` queries across multiple mapped iterations into a single flattened query improves data retrieval time.
