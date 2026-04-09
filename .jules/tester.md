## 2024-04-09 - Zustand store auth fallback
**Gap:** Authentication store fallback behavior (PGRST116 code from Supabase) for missing profiles wasn't tested.
**Learning:** Testing Zustand stores which fetch data via mocked APIs requires carefully simulating the internal `select().single()` chaining for both the initial fetch and the fallback `insert().select().single()` operation. In Zustand tests, mocking chaining syntax directly inline inside the mock factory was crucial.
**Pattern:** For Zustand API fallbacks, use `vi.fn().mockImplementation` chained all the way to `single()` to mock fallback branches explicitly, allowing verification of retry/insert operations on missing rows.
