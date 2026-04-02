## 2026-04-02 - Improve empty state for assignments in Student Dashboard
**Problem:** The assignments section in the student dashboard had a plain text empty state, which lacked visual hierarchy and feedback compared to the recent experiments section.
**Context:** Students without assignments may find the plain text easy to miss or confusing as to whether the section is broken or legitimately empty.
**Solution:** Added the existing `EmptyState` component for the assignments list to maintain visual consistency across the application and provide clearer feedback.
