## 2026-05-29 - Be careful with extracting data fetching
**Before:** Duplicate code blocks inside two different `useEffect` hooks fetched the current user, classrooms, and student IDs sequentially.
**Issue:** Extracting too much logic into a helper function caused multiple nested DB calls and broke an important filtering scope logic (`.in('classroom_id', ...)`).
**Learning:** Only extract exactly what is identical. In this case, fetching the user and their classroom IDs was identical, but the final data fetching queries were fundamentally different.
