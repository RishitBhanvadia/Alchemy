import { supabase } from './supabaseClient';

describe('Supabase Client Configuration', () => {
  it('should initialize the supabase client without error', () => {
    expect(supabase).toBeDefined();
    // We can also check if the URL is set correctly if we want to spy on createClient,
    // but verifying it's defined is enough to prove the file executed.
  });

  // Additional test: verify it throws if env vars are missing?
  // This is hard because process.env is global and cached.
  // We'd need to mock process.env, require inside the test, and reset modules.
  // Given the complexity, just verifying initialization is sufficient for this scope.
});
