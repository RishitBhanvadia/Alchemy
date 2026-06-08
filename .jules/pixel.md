## 2024-05-18 - Improve Empty State Design
**Problem:** The EmptyState component is generic and somewhat boring, and it's used across multiple pages.
**Context:** This app is a virtual chemistry lab, so the empty state could be more engaging and thematic (e.g. animated beaker/flask, better glow/glass effects). The primary empty state in StudentDashboard ("Recent Experiments") uses this component.
**Solution:** Improve the `EmptyState` component visually, integrating it better with the neon/glassmorphism theme, possibly with a subtle pulsing animation on the icon and better typography hierarchy.
