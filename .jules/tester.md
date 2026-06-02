## 2024-06-02 - User authentication flows
**Gap:** The authStore which manages critical login, logout, and user session initialisation was completely untested, leading to potential silent failures during authentication state changes.
**Learning:** Testing auth flows requiring a Supabase client requires careful mocking of Supabase chain functions like .from().select().eq().single() to mimic its nested structure.
**Pattern:** Mock the Supabase client entirely and chain vi.fn().mockReturnThis() to verify data access and auth event handling without side-effects.
