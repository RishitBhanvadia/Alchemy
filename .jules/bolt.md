## 2024-05-09 - N+1 Query in Promise.all with Supabase
**Learning:** Performing a Supabase query inside a `Promise.all` mapping over a dataset (like classrooms) causes a severe N+1 performance bottleneck. Consolidating the queries into a single `.in()` batched query with a hard upper bound (`.limit(5000)`) significantly improves performance and memory consumption.
**Action:** Always batch queries for related items (like experiments for students) into a single query using `.in()` and group the results in-memory rather than querying in a loop.
