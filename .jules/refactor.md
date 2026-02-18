## 2025-02-12 - Extracting Complex SVG Path Logic
**Before:** Hardcoded SVG path strings with magic numbers and string concatenation directly inside `useEffect` and event handlers.
**Issue:** Logic was duplicated, untestable, and hard to read. Small inconsistencies (e.g., `644` vs `644.637`) existed due to copy-pasting.
**Learning:** Extracting this logic into a pure utility function (`generateAcidPath`) not only cleaned up the component but also revealed and allowed unification of these minor inconsistencies. This pattern (moving complex visual logic to utilities) is highly effective for this project's heavy use of SVG manipulation.
## 2025-02-12 - Critical Dependency Compatibility in CI
**Before:** `jsdom` version 28.1.0 was installed by default with `vitest` 4.0.18.
**Issue:** CI Environment runs Node 18 (18.20.8). `jsdom` 26+ requires Node 20+. This caused `html-encoding-sniffer` (a `jsdom` dependency) to fail with `require() of ES Module ... not supported` because newer `jsdom` versions use ESM-only sub-dependencies not fully compatible with Vitest's CJS loading in Node 18.
**Learning:** When working with Node 18 CI environments, explicitly downgrade `jsdom` to v25.0.1. This version maintains compatibility with Node 18 and avoids the ESM require errors in Vitest.
