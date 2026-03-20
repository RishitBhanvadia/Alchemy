## 2024-05-24 - Empty States Should Match Context
**Problem:** The `EmptyState` component used across dashboards only rendered the exact same generic envelope icon ("📭") for everything (no students, no experiments, etc).
**Context:** For a chemistry app, standard business icons make it feel generic. A science app needs science context to maintain immersion.
**Solution:** Added dynamic emoji/icons for specific contexts instead of a hardcoded envelope.
