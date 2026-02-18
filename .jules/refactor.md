## 2025-02-12 - Extracting Complex SVG Path Logic
**Before:** Hardcoded SVG path strings with magic numbers and string concatenation directly inside `useEffect` and event handlers.
**Issue:** Logic was duplicated, untestable, and hard to read. Small inconsistencies (e.g., `644` vs `644.637`) existed due to copy-pasting.
**Learning:** Extracting this logic into a pure utility function (`generateAcidPath`) not only cleaned up the component but also revealed and allowed unification of these minor inconsistencies. This pattern (moving complex visual logic to utilities) is highly effective for this project's heavy use of SVG manipulation.
