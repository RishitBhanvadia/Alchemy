const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder') {
  // eslint-disable-next-line no-console
  console.warn('Missing Supabase credentials in environment variables. Falling back to placeholder values.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
