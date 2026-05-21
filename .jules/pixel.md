## 2024-05-21 - Standardise Empty States in Classroom Details
**Problem:** The ClassroomDetail page displayed unstyled text (`<p className="empty-msg">No students enrolled yet.</p>` and a table row) for empty student rosters and assignment lists, causing visual inconsistency and lacking clear guidance for users.
**Context:** Consistent and helpful empty states are critical for a seamless user experience, especially in a teacher dashboard where users need to know how to proceed when lists are empty.
**Solution:** Replaced manual text messages with the application-wide `EmptyState` component, providing an icon, clear title, and instructional description to guide teachers on how to populate the lists.
