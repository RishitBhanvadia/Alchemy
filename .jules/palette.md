## 2024-05-18 - Missing Confirmation for Destructive Actions
**Learning:** Found a potentially dangerous interaction in `ClassroomDetail.jsx` where clicking a trash icon immediately deletes an assignment without any confirmation dialog, and the icon lacks screen reader accessibility labels.
**Action:** Added `window.confirm` to intercept the deletion, and added `aria-label` and `title` to the icon-only button to ensure screen readers and mouse hover users understand its function before clicking.
