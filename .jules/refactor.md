## YYYY-MM-DD - [Title]
**Before:** [What the code looked like]
**Issue:** [Why it needed refactoring]
**Learning:** [What worked/didn't work]
## 2024-05-24 - Flatten deeply nested if-else into early returns inside useEffect
**Before:** Deeply nested if-else chain tracking state variables directly inside a function that had to be manually called after every state update. Handlers also contained empty if-else commented sections.
**Issue:** Poor readability, nested code complexity, and manual synchronization of state dependencies causing unnecessary repeated logic and trailing empty scopes.
**Learning:** React `useEffect` with dependency arrays cleanly handles automatic UI synchronizations from multiple source states. Early returns substantially flatten deep conditionals making the logic self-documenting and easier to modify.
