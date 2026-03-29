## 2025-01-31 - N+1 query in loop
**Learning:** Found an N+1 query in `teacherController.js` where `experiment_results` was queried individually inside a `Promise.all` loop for each classroom.
**Action:** Replaced it with a single `.in('user_id', allStudentIds)` bulk fetch and grouped the results using a JavaScript `Map` for O(1) lookups during the loop, significantly reducing database load and latency.
