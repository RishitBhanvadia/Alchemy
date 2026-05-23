## 2025-05-23 - Add authStore tests
**Gap:** The critical `authStore` component logic for fetching/refreshing the session and handling profiles was untested.
**Learning:** Testing Zunstand stores interacting with external APIs (like Supabase) requires careful mocking of both the store API and the external client, specifically mimicking complex nested promises like `select`, `single` and `eq`.
**Pattern:** Creating mock functions for Supabase response chaining (`.from().select().eq().single()`) allows comprehensive unit testing of Zunstand store init behavior without real DB interactions.
