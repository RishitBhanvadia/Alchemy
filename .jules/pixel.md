## 2024-04-15 - Fix `max-max-width` typos breaking layouts
**Problem:** Multiple CSS files contained an invalid property `max-max-width` and `min-max-width` instead of `max-width` and `min-width`, which broke the responsive layout boundaries.
**Context:** The application is a virtual chemistry lab, and a broken layout makes it difficult to navigate dashboards, classrooms, and experimental tools, particularly on varying screen sizes. These typos cause constraints to fail.
**Solution:** Replaced all instances of `max-max-width` with `max-width` and `min-max-width` with `min-width` across the entire `client/src` directory, restoring proper responsive constraints.
