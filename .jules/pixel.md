2025-06-01 - Fix broken CSS max-max-width values
**Problem:** The app had multiple instances of invalid CSS properties like `max-max-width` and duplicated `width: 100%;` declarations across many stylesheet files.
**Context:** These broken properties cause the browser to ignore the constraints, which likely broke layouts and caused elements to overflow or stretch incorrectly on certain screens.
**Solution:** I used a regular expression to clean up the invalid CSS properties, replacing `max-max-width` with `max-width` and `min-max-width` with `min-width`, and also removing the duplicated `width: 100%;` lines that were left behind from previous faulty replacements.
