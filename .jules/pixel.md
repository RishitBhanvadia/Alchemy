## 2024-05-18 - Improve Empty States Visual Hierarchy
**Problem:** The empty state for student assignments was just a raw text span (`<span>No assignments yet...</span>`), which broke the visual hierarchy and looked unfinished compared to the surrounding glassmorphic cards.
**Context:** Consistent empty states are critical for guiding users in this application, especially in dashboard views where lack of data shouldn't look like a layout bug.
**Solution:** Wrapped the empty message in a `glass-card` and replaced the raw text with the reusable `EmptyState` component, providing an icon, clear title, and subtitle to maintain visual rhythm.
