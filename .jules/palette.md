## 2024-03-04 - Authentication Form Loading State
**Learning:** Adding a loading state and visual feedback (e.g. changing text to 'ACCESSING...') to auth/form submit buttons prevents duplicate submissions and keeps the user informed, especially with network delays. The disabled attribute is also crucial to ensure keyboard accessibility isn't compromised while an action is in progress.
**Action:** When implementing new forms with async submission logic, proactively include `isLoading` states that disable the button and add the `aria-busy` attribute for screen reader clarity.
