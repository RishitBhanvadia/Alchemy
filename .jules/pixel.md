## 2024-05-27 - Standardize Max Width Properties
**Problem:** Across the codebase, there was a typo where CSS variables were meant to be used or properties were misnamed (`max-max-width` and `min-max-width` instead of `max-width` and `min-width`), causing layout inconsistency or broken layouts.
**Context:** The app's dashboard and layouts depend heavily on accurate CSS styling. `max-max-width` causes styles to break or fall back, resulting in a layout that doesn't respect the design constraints on different screen sizes. This matters heavily for this application since there's a lot of dashboards and panels.
**Solution:** Replaced all instances of `max-max-width` with `max-width` and `min-max-width` with `min-width` across all CSS files.
