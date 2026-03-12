## 2023-10-27 - Test utility notification functions
**Gap:** The utility functions `showLoading` and `dismissToast` in `client/src/utils/notifications.js` were missing test coverage.
**Learning:** Adding coverage for loading notifications and explicit dismissal improves overall utility reliability.
**Pattern:** Mock `toast.loading` to return a specific ID and mock `toast.dismiss` to assert it is called correctly with that ID.