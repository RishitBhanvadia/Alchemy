const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('Missing or invalid SUPABASE_URL in environment variables.');
  supabaseUrl = 'https://placeholder.supabase.co';
}
if (!supabaseKey || supabaseKey === 'undefined') {
  console.error('Missing or invalid SUPABASE_SERVICE_ROLE_KEY in environment variables.');
  supabaseKey = 'placeholder-key';
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
