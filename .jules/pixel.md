## 2025-06-11 - Accessibility Fix: AI Tutor Button
**Problem:** The AI Tutor toggle button is purely decorative with a robot emoji ("🤖") and lacks screen-reader accessibility, even though it has a visual title.
**Context:** This button is critical for students to access the AI tutor in the 3D lab. Without `aria-label`, screen readers might just read "robot face", confusing visually impaired users. Additionally, emojis shouldn't be read as text.
**Solution:** Added `aria-label` to the button for screen readers, and `aria-hidden="true"` to the inner emoji wrapper so it is skipped. Also added `aria-haspopup="dialog"` and `aria-expanded` to properly indicate the state of the tutor panel.
