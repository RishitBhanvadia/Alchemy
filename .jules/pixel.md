## 2026-03-04 - Fix Button Text Contrast Failure
**Problem:** The primary call-to-action buttons ('.start-button', '.login-button') had poor colour contrast (white text on a bright cyan background), causing visual accessibility failures and making them difficult to read.
**Context:** The app's core design system uses a bright cyan neon color ('--primary-neon') for primary actions. However, applying bright text over a bright background created severe UX friction for users.
**Solution:** Changed the button text color to a deep navy ('#050510') and increased the font weight to '700' for both Landing and Login buttons. Adjusted box-shadows to ensure readability and maintain the neon aesthetic without compromising accessibility.
