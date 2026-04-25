## 2024-05-20 - Incorrect average score calculation due to null values
**Bug:** The average score calculation in `getAnalytics` (`server/controllers/teacherController.js`) treats `null` or `undefined` scores as 0 and includes them in the denominator, which incorrectly lowers the true average score.
**Root Cause:** The calculation `Math.round(logs.reduce((sum, l) => sum + (l.score || 0), 0) / logs.length)` does not filter out logs with missing scores before computing the average.
**Learning:** Always filter out `null` or `undefined` values before calculating aggregated statistics (like averages) to prevent missing data from skewing the results.
