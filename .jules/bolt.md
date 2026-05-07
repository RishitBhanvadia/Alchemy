
## 2024-05-06 - Consolidate N+1 Supabase queries
**Learning:** When consolidating N+1 Supabase queries into a single `.in()` batched query, applying a hard upper bound (e.g., `.limit(5000)`) prevents massive memory consumption in the Node.js process before performing in-memory grouping and filtering.
**Action:** Always add a hard upper bound to batched queries.
