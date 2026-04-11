## 2024-04-11 - Resolving N+1 Database Queries
**Before:** The `getAnalytics` controller mapped over multiple `classrooms` and made independent `experiment_results` queries for each one inside a `Promise.all` block.
**Issue:** Making queries in a loop leads to N+1 query performance bottlenecks. This places unnecessary load on the Supabase backend and slows down the API response time as data sets grow.
**Learning:** For relational lookups, it's better to extract the IDs (e.g., student IDs) into a single flat array and use a batched `.in()` Supabase query. The results can then be grouped or filtered locally in Node, turning O(N) database trips into O(1).
