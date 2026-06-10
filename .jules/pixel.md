## 2026-06-10 - Fix invalid CSS min/max width properties
**Problem:** Invalid CSS properties `min-max-width` and `max-max-width` were found across multiple CSS files, likely causing layout issues or being ignored by browsers.
**Context:** This was an unintentional typo or search/replace error in the codebase that affected responsive layouts.
**Solution:** Fixed by globally replacing `min-max-width` with `min-width` and `max-max-width` with `max-width` using bash.
