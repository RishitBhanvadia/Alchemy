## 2024-05-05 - Consolidating Supabase Queries
**Learning:** When fetching data for multiple entities in an array loop (N+1 queries) using Supabase, you can consolidate the calls into a single query using `.in()`. To avoid massive memory consumption, make sure to add a hard upper bound like `.limit(5000)`.
**Action:** Replace `Promise.all` with multiple queries with a single query using `.in()` and process data in-memory locally.
