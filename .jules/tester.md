## 2024-06-18 - Tested Auth Store Edge Cases
**Gap:** Authentication state management and profile fetch error states (PGRST116 for Supabase when no user is found and a profile needs to be created on the fly) were not tested.
**Learning:** Testing Zunstand stores that interact with multiple Supabase DB layers often uncovers race conditions or implicit requirements, like profile generation. The mock structure for Supabase chain methods (e.g. from().select().eq().single()) can be complex but is necessary. We must deeply mock the Supabase client methods to properly simulate these scenarios.
**Pattern:** Deep mock of Supabase's `from().select().eq().single()` chains in Vitest to isolate and test store initialization, session handling and logout logic.
