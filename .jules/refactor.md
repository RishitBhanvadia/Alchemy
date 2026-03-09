## 2026-03-09 - Simplification of verbose manual counting & condition flattening
**Before:** Manual counting of conditions with many empty blocks:
```javascript
let isTOn = 0;
if (chemA > 0) { isTOn++; }
if (chemB > 0) { isTOn++; }
// ...
if (isTOn >= 2) return true;
```
Also, multiple empty conditional blocks existed within change handlers (e.g., `if (value !== 0) {} else {}`).
**Issue:** Highly verbose code taking up unnecessary space, empty blocks decreasing readability, and nested conditions `if (t === 0) {} else { if (t === 1) {} else { ... } }` creating "callback hell" style deeply nested `if` statements for simple sequential logic.
**Learning:** Replaced the manual condition-counting pattern with a functional approach `[chemA, chemB, ...].filter(c => c > 0).length >= 2` which is significantly cleaner and less error-prone. Replaced deeply nested `if/else` with sequential `if / else if` to heavily reduce cyclomatic complexity and indentation depth. Removed empty conditional blocks by directly updating state regardless of the specific value check when it had no side-effects.
