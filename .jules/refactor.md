# Refactor Journal

## 2025-02-14 - Extracting SVG Logic
**Before:** Hardcoded SVG path concatenation mixed with component state logic (e.g., `setAcid("M226... " + (644 - count) + "H226...")`).
**Issue:** Difficult to test and maintain the SVG path generation logic; component was cluttered with magic strings and complex state updates.
**Learning:** Extracting pure functions for SVG path generation (e.g., `calculateAcidPath`) makes unit testing trivial and declutters the React component significantly, separating view logic from calculation logic.
