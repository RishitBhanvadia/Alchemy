## 2024-06-09 - Improve empty state for history panel in Lab3D
**Problem:** The history side panel in the Lab3D page used a plain text paragraph (`<p className="empty-history">`) when empty, causing an inconsistent and confusing experience compared to other empty states across the application.
**Context:** This app heavily features an immersive 3D lab environment. When users first open the lab, the history panel is empty, and a cohesive, visually appealing empty state is crucial for a consistent design system.
**Solution:** Replaced the plain text with the application's established `EmptyState` component, providing an appropriate icon, title, and description while retaining the slide-in animation layout.
