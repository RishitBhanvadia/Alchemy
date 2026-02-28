## YYYY-MM-DD - [Title]
**Before:** [What the code looked like]
**Issue:** [Why it needed refactoring]
**Learning:** [What worked/didn't work].

## 2024-03-24 - Extract Change Handler Logic
**Before:**
```javascript
const handleChemAChange = (e) => {
    const value = parseInt(e.target.value);
    setChemA(value);
    change_tip();
};
// Repeated for chemB, chemC, chemD
```
**Issue:** Boilerplate state updater code in `lab.jsx` was repeated 4 times, violating DRY principle and increasing risk of bugs when making changes to how state updates happen.
**Learning:** Returning a curried function `createChemChangeHandler` correctly encapsulates standard React onChange events while still closing over the component's state setters. Extracting repeated form input handlers into a factory function drastically reduces line count and makes uniform handling (like ensuring the default value is 0 instead of NaN if `parseInt` fails) simpler to implement across all inputs.