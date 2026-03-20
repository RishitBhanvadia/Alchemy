# Tester's Journal

## 2024-05-24 - Missing Supabase Environment Variables in Tests
**Gap:** The authentication and store test files crashed due to missing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables.
**Learning:** CI or test environments often lack environment variables that are present in local development `.env` files.
**Pattern:** For `supabaseClient.js`, conditionally check `import.meta.env.VITE_SUPABASE_URL` against `undefined` strings (a common Vite issue) and provide fallback string values like `'https://placeholder.supabase.co'` and `'placeholder-key'` to ensure tests can initialize without crashing.
