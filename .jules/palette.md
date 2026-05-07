## 2025-03-08 - Icon-only buttons lacking ARIA labels
**Learning:** Found multiple instances where icon-only buttons (like the copy button in ClassroomManager.jsx or back button in JoinMeetingPanel.jsx) do not have aria-labels, rendering them inaccessible to screen readers.
**Action:** Always add descriptive aria-labels or visually hidden text to buttons that only contain icons (like "📋" or "✕" or "←").
