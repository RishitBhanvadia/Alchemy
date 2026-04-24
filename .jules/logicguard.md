## 2024-04-24 - Fix teacher analytics average score calculation ignoring unattempted/null experiments
**Bug:** Average score calculation in `getAnalytics` treats null or undefined scores (representing unattempted or incomplete experiments) as 0, artificially lowering the class average.
**Root Cause:** The logic uses `l.score || 0` and divides by the total `logs.length` without filtering out the null/undefined scores first.
**Learning:** When calculating aggregated statistics (like averages) from database records, always explicitly filter out null or undefined values before calculation to prevent un-attempted or missing data from skewing the results as zero.
