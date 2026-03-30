## 2024-03-30 - Added confirmation prompt and accessibility labels to delete assignment button
**Learning:** Destructive actions like deleting an assignment should always have a confirmation step to prevent accidental data loss. Icon-only buttons must have `title` and `aria-label` attributes for accessibility and clarity.
**Action:** Always wrap destructive actions in a `window.confirm` dialog or similar confirmation pattern. Ensure all icon-only buttons have descriptive `title` and `aria-label` attributes.
