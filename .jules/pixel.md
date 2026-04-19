## 2024-04-19 - Removed Duplicate States
**Problem:** The `CursorFollower` component had duplicated state declarations that were crashing the build.
**Context:** This was breaking the entire UI deployment for all users.
**Solution:** Removed the duplicate declarations.
## 2024-04-19 - Standardized Empty States in ClassroomDetail
**Problem:** The `ClassroomDetail.jsx` page displayed unstyled, hardcoded text ("No students enrolled yet", "No assignments created yet") instead of leveraging the app's established empty state component.
**Context:** This caused visual inconsistency compared to `StudentDashboard` and `History` pages, making the UI feel unpolished and reducing clear guidance for teachers using the app.
**Solution:** Replaced the hardcoded strings with the existing `<EmptyState />` component, supplying context-appropriate icons, titles, and descriptions for both student lists and assignments tables to maintain design system consistency.
## 2024-04-19 - Fixed CI Workflow Server Timeout
**Problem:** The GitHub Actions CI `build-server` step was hanging indefinitely ("The job has exceeded the maximum execution time of 6h0m0s") when testing server startup because `app.listen()` kept the Node.js event loop active.
**Context:** This was completely blocking deployments, rendering our UI improvements undeployable and making the development environment feel unstable.
**Solution:** Added a `setTimeout(() => process.exit(0), 2000);` to the `node -e` script in `.github/workflows/build-check.yml` to force the server script to exit successfully after initialization.
