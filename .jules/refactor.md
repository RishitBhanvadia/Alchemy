## 2024-03-25 - Simplify chemical state handlers
**Before:** Repetitive state handlers (e.g. handleChemAChange) for 4 chemicals and deep nesting in change_tip().
**Issue:** Code duplication and high cyclomatic complexity make the component harder to read and maintain.
**Learning:** Extracting repeated state change logic into a generic handler parameterised by the state setter significantly reduces boilerplate. Using a linear if/else if chain is much clearer than nested if/else statements for exclusive conditions.
