## 2024-05-22 - Extracted duplicated join classroom logic
**Before:** `Dashboard.jsx` had a duplicated 30-line `handleJoinClassroom` function that directly queried Supabase logic and state (already implemented in `classroomStore.js`).
**Issue:** Violates the DRY principle and scatters data access logic, making it harder to test or change in one place.
**Learning:** Refactoring scattered, direct Supabase calls into existing Zustand store methods (`joinClassroom`) drastically simplifies React components and keeps data manipulation unified.
