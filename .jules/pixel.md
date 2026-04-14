## YYYY-MM-DD - Fix invalid max-max-width CSS property
**Problem:** Across the codebase, the CSS property `max-max-width` (and `min-max-width`) was used instead of the valid `max-width` (and `min-width`) property. This resulted in the max-width rule being ignored by the browser.
**Context:** This was an app-wide typo that affected many layout components such as Modals, EmptyStates, and responsive page containers.
**Solution:** Fixed the typo across all `.css` files by replacing `max-max-width` with `max-width`, and `min-max-width` with `min-width`, which allows the browsers to correctly apply responsive layout constraints.
