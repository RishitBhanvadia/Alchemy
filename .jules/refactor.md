## 2025-02-24 - Extract generic generateUniqueCode to eliminate unbounded loops
**Before:** Duplicated ID generation code in both `meetingController.js` and `classroomController.js`. The classroom one used an unbounded `do-while` loop for collision resolution which could potentially lock up the event loop in worst-case scenarios.
**Issue:** Code duplication and unbounded loops.
**Learning:** Creating a utility that abstracts Supabase lookups with a maximum retry count (e.g., 10) prevents unbounded loops, and abstracting it to handle arbitrary column and table names eliminates repeated logic.
