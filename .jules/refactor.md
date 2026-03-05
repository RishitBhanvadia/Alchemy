## 2024-05-24 - Extracting Event Handlers and State Deduplication
**Before:** Multiple state variables tracking similar items (`chemA`, `chemB`, `chemC`, `chemD`) with redundant duplicated event handler methods (`handleChemAChange`, `handleChemBChange`, etc.).
**Issue:** Boilerplate state variables and duplicated event handlers for dynamic elements making changes harder, maintaining identical logic is error prone.
**Learning:** Extract shared repetitive logic in a unified state/event handler mechanism where possible.
