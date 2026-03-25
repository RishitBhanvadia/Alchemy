const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables.');
}

// Fallbacks for test/CI environments only, to prevent crashing Vitest/Jest during startup checks
const finalUrl = supabaseUrl || (process.env.NODE_ENV === 'test' ? 'https://placeholder.supabase.co' : undefined);
const finalKey = supabaseKey || (process.env.NODE_ENV === 'test' ? 'placeholder_key' : undefined);

const supabase = createClient(finalUrl, finalKey);

module.exports = supabase;
