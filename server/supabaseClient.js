const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const envUrl = process.env.SUPABASE_URL;
const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!envUrl || !envKey) {
  console.error('Missing Supabase credentials in environment variables.');
}

const supabaseUrl = envUrl || 'https://placeholder.supabase.co';
const supabaseKey = envKey || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
