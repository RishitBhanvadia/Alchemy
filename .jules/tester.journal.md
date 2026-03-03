## 2023-10-25 - Add Tests for History Component
**Gap:** The history.jsx component, which fetches user experiment data from Supabase and handles different rendering states (loading, empty, success, error) was completely untested.
**Learning:** Testing data-fetching components requires correctly mocking out the Supabase query chain and dealing with asynchronous updates effectively to verify UI states like loading spinners and error states. Mocking vi.hoisted variables prevents import scoping issues.
**Pattern:** For Supabase queries, mock the returned builder chain to easily simulate data or error responses, then test the DOM states via await waitFor to verify successful rendering transitions.
