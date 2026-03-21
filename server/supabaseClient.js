const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const envUrl = process.env.SUPABASE_URL;
const envKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseUrl = envUrl || 'https://placeholder.supabase.co';
const supabaseKey = envKey || 'placeholder_key';

if (!envUrl || !envKey) {
  console.error('Missing Supabase credentials in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
