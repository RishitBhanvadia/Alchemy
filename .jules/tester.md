## 2024-03-10 - Fix test configuration issue and write authentication flow tests
**Gap:** Login component had failing tests due to Vitest configuration and mocking issues, Dashboard tests failed due to text/markup changes, Navbar had uncovered interactive parts. Playwright tests were being run by Vitest causing describe block errors.
**Learning:** React Testing Library expects `href` attribute on anchor tag for assertions rather than clicking and expecting router mock to be called (when using the `a` tag). Also, Playwright describe blocks break when picked up by Vitest so we need to exclude them from vitest's test config.
**Pattern:** Mock supabase correctly in `vi.mock` factory (avoiding scope issues), exclude `tests/` directory from Vitest to avoid Playwright test conflict.
