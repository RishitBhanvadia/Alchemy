## 2026-04-20 - Vitest Mocking of Chained Supabase Client Queries
**Gap:** The authentication flow (`useAuthStore.init()`) was untested, leaving critical session and profile fetching behavior unverified.
**Learning:** Testing Supabase's chained query API (e.g., `.select().eq().single()`) can be tricky because simply mocking the root `supabase.from` will lead to `Cannot read properties of undefined` runtime errors when the chained methods aren't returned.
**Pattern:** Construct the mock by creating chained `vi.fn()` objects that return the next method in the chain. For example:
`const mockSingle = vi.fn().mockResolvedValue({ data: mockProfile, error: null });`
`const mockEq = vi.fn(() => ({ single: mockSingle }));`
`const mockSelect = vi.fn(() => ({ eq: mockEq }));`
`supabase.from.mockReturnValue({ select: mockSelect });`
This ensures the full chain resolves cleanly during component and store tests.
