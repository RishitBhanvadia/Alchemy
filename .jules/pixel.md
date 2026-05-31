## 2026-05-31 - Fix Invalid CSS Properties (min-max-width and max-max-width)
**Problem:** The CSS codebase contains invalid properties `min-max-width` and `max-max-width` across multiple files. These do not exist in CSS and would be ignored by browsers, likely breaking intended responsive max-width behaviors and responsive grid/layout behaviors.
**Context:** These were likely typos for `max-width` and `min-width` that were blindly copy-pasted across the codebase. Since they are invalid, any intended responsive behavior using these properties would be broken.
**Solution:** Fixed all occurrences of `max-max-width` to `max-width` and `min-max-width` to `min-width` across the app's CSS files.
