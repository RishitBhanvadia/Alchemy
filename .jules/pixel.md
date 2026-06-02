2024-05-24 - Improve assignments empty state in StudentDashboard
**Problem:** Weak empty state for assignments in the student dashboard, leading to inconsistent visual hierarchy.
**Context:** The dashboard uses a high-quality EmptyState component for history, but falls back to a simple unstyled div for missing assignments, making the UI feel broken or unpolished.
**Solution:** Replaced the basic text with the established `EmptyState` component, maintaining visual consistency across dashboard sections and providing clear context to the user.
