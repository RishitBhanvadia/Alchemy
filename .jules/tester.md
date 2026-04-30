## 2024-03-24 - Test authentication store functionality
**Gap:** The critical user authentication flow in the frontend store `authStore.js` had missing unit tests.
**Learning:** This gap meant regressions in login sessions, auto-logout logic, and default profile creation could occur unnoticed.
**Pattern:** Created tests using isolated vitest vi.mock setups that fake supabase auth state properly.
## 2024-03-24 - Test classroom store functionality
**Gap:** The critical user classroom flows (fetching membership, joining classes, creating classes) in the frontend store `classroomStore.js` had missing unit tests.
**Learning:** This gap meant regressions in core teacher and student features could occur unnoticed, particularly edge cases like handling unauthenticated states or duplicate class joining.
**Pattern:** Created thorough tests using isolated vitest vi.mock setups that fake supabase auth and database state properly, validating store mutation side effects.
## 2024-03-24 - Test profile store functionality
**Gap:** The critical user profile store logic (fetching stats, calculation of XP and score from logs) in the frontend store `profileStore.js` had missing unit tests.
**Learning:** Missing these tests could lead to bugs in student profile page showing wrong accuracy stats, best score, and earned XP.
**Pattern:** Created tests using isolated vitest vi.mock setups that fake multiple parallel supabase queries (`Promise.all`), validating store derived calculation logic from the fake fetched data.
## 2024-03-24 - Test history store functionality
**Gap:** The frontend store `historyStore.js` logic for fetching student experiment logs had missing unit tests.
**Learning:** These missing tests left error handling and data loading cache conditions untested, potentially resulting in missing error boundaries.
**Pattern:** Similar to the other stores, added testing with `vi.mock` for the `supabaseClient` to fake responses and error conditions.
