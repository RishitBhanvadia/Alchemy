## 2024-05-24 - Improve Assignments Empty State
**Problem:** The assignments list in the student dashboard displayed a raw HTML div with plain text when empty, causing visual inconsistency.
**Context:** Empty states are crucial for guiding users. A plain string breaks the immersion of the app's glassmorphism design.
**Solution:** Replaced the plain div with the existing `EmptyState` component for visual consistency and better user feedback.
