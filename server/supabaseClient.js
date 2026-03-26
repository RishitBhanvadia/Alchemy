const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl) supabaseUrl = 'https://placeholder.supabase.co';
if (!supabaseKey) supabaseKey = 'placeholder_key';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder_key') {
  console.error('Missing Supabase credentials in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
