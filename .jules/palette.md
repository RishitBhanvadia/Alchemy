## 2024-04-01 - Add Confirmation Dialogues for Destructive Actions
**Learning:** Users can accidentally delete assignments when clicking the trash can icon without a confirmation prompt, and icon-only buttons lack clarity for screen readers.
**Action:** Always wrap destructive actions in a `window.confirm` and ensure icon-only buttons have descriptive `title` and `aria-label` attributes for accessibility.
