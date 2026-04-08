## 2025-02-12 - Add confirmation dialogue for destructive assignment deletion
**Problem:** Deleting assignments in ClassroomDetail occurred immediately upon clicking the trash icon, leading to potential accidental data loss.
**Context:** Teachers managing classroom assignments need a frictionless but safe way to remove incorrect or outdated tasks. Without confirmation, misclicks result in permanent removal.
**Solution:** Replaced direct `deleteAssignment` call with a `handleDeleteAssignment` wrapper that invokes `window.confirm` to act as a safeguard. Added appropriate `title` and `aria-label` attributes to the button for better accessibility.
