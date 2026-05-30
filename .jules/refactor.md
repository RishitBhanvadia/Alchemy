## 2024-05-18 - Extract Meeting Auth Logic
**Before:** `meetingController.js` has over 400 lines and is a god controller handling meeting creation, joining, Google OAuth state generation, token exchange, caching tokens, and creating meetings for both Zoom and Google Meet.
**Issue:** `meetingController.js` is too long, does too many things, mixes authentication/authorization logic with meeting business logic, and is hard to test.
**Learning:** Extracting Google Auth logic into a separate utility or service makes the controller much cleaner and more maintainable.
