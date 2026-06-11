## 2024-06-11 - Make Emoji Toggle Buttons Accessible
**Learning:** Icon-only and emoji toggle buttons in the ClassroomManager (like the chemical locks) lacked screen reader context and state announcement.
**Action:** Always add `aria-label` describing the action, reflect state dynamically using `aria-pressed`, and apply `aria-hidden="true"` to purely decorative visual emoji icons.
