## 2024-04-12 - Added EmptyStates for Lists

**Problem:** Blank screens and raw text placeholders caused UX friction when users viewed lists with no data (e.g. assignments, experiment histories).
**Context:** It is critical for a learning tool to guide the user (students and teachers alike) when they have no content, to help them figure out what their next action should be.
**Solution:** Refactored multiple React components (`ClassroomDetail.jsx`, `Lab3D.jsx`, `StudentDashboard.jsx`) to use the built-in and styled `<EmptyState />` component instead of plain text spans or empty space, ensuring a consistent design system and helpful user guidance.
