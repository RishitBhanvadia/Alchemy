## 2025-02-18 - Component Configuration Extraction
**Before:**
`Lab.jsx` had 4 duplicated blocks of code for rendering chemical inputs, each with its own state variable (`chemA`, `chemB`...) and handler.
**Issue:**
High code duplication, magic numbers (colors), and hard-to-maintain state logic. Adding a new chemical would require copy-pasting code in 5 different places.
**Learning:**
Extracting configuration into a `CHEMICALS` constant array and using a unified state object (`chemicals`) allowed rendering inputs via `map`, reducing lines of code and centralizing logic. Derived state for `tcolor` eliminated the need for a separate, potentially buggy state update function.
