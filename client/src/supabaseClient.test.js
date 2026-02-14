
// Remove top level import
// import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('supabaseClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('throws error if env vars are missing', () => {
    delete process.env.REACT_APP_SUPABASE_URL;
    delete process.env.REACT_APP_SUPABASE_ANON_KEY;
    expect(() => require('./supabaseClient')).toThrow('Supabase URL or Anon Key is missing');
  });

  it('initializes supabase if env vars are present', () => {
    process.env.REACT_APP_SUPABASE_URL = 'https://example.supabase.co';
    process.env.REACT_APP_SUPABASE_ANON_KEY = 'fake-key';

    require('./supabaseClient');

    // Require the mock to get the current reference
    const { createClient } = require('@supabase/supabase-js');
    expect(createClient).toHaveBeenCalledWith('https://example.supabase.co', 'fake-key');
  });
});
