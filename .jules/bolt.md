## 2026-04-24 - Prevent redundant AI hint calls with Map cache
**Learning:** In Lab3D, debounced API calls for AI hints re-fetch from the server even if the exact chemical concentrations were queried recently.
**Action:** Implemented a module-level Map cache to store hint responses keyed by concentration values. This prevents redundant network requests and server processing when a user adjusts sliders back to previously queried states.
