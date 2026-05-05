## 2024-05-05 - Add tooltips to floating action buttons
**Problem:** Floating action buttons (History, AI Tutor) only have emojis, which might be confusing for users to know what they do until they click. Native browser tooltips via the 'title' attribute are delayed and don't match the glassmorphic design system.
**Context:** In the 3D lab environment, these floating buttons are the primary way to access history and help. Adding a custom, immediate tooltip on hover helps users know exactly what the button does while maintaining immersion.
**Solution:** Replaced 'title' attributes with 'data-tooltip' on floating action buttons in Lab3D and implemented custom CSS using the ::before pseudo-element with glassmorphism to provide immediate, context-aware visual feedback.
