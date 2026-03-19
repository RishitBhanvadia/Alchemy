const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || supabaseUrl === 'undefined' || !String(supabaseUrl).startsWith('http')) {
  supabaseUrl = 'https://placeholder.supabase.co';
}

if (!supabaseKey || supabaseKey === 'undefined') {
  supabaseKey = 'placeholder-key';
}

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.error('Missing Supabase credentials in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
