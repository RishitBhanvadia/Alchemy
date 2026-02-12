## 2026-02-12 - Loading States in Authentication
**Learning:** Users lack confidence in authentication forms without immediate feedback, potentially leading to double submissions or abandonment.
**Action:** Always implement a dedicated `isLoading` state for auth actions, disabling the submit button and providing clear text feedback (e.g., "Accessing...") to reassure the user that the request is processing.
