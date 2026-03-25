## 2024-05-18 - Incorrect state property used for chemD assignment
**Bug:** The AI Tutor panel read the value for the `chemD` variable from `state.chemC` instead of `state.chemD`.
**Root Cause:** A copy-paste error during component implementation where `chemC` was duplicated for `chemD` without updating the object property being accessed.
**Learning:** Always double-check variable assignments when copying and pasting lines, especially when accessing state from a store, to ensure the correct properties are referenced.