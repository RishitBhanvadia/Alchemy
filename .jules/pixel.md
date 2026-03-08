## 2024-03-08 - Added Missing neon-button Global Style
**Problem:** The primary interaction buttons on the Organic and Inorganic pages were completely unstyled because they used a `neon-button` class that didn't exist in the CSS. This caused severe UX friction as the primary actions looked like unstyled browser defaults.
**Context:** For this specific application, maintaining the glassmorphism and neon aesthetic is critical for immersion. The `test-btn` and `submit-btn` needed to look like interactive dashboard elements.
**Solution:** Added the `.neon-button` global utility class to `client/src/index.css` utilizing existing design tokens (`var(--primary-neon)`) and consistent hover/active state animations to match the rest of the app's interactive elements.
