const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

// Fallback keys so CI/Tests don't fail immediately on startup without real env vars.
// The backend uses SUPABASE_SERVICE_ROLE_KEY but the CI provides SUPABASE_SERVICE_KEY.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder') {
  console.error('Missing Supabase credentials in environment variables. Using placeholders.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
