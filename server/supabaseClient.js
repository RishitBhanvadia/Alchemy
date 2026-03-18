const supabaseUrl = process.env.SUPABASE_URL && process.env.SUPABASE_URL.startsWith('http') ? process.env.SUPABASE_URL : 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY && process.env.SUPABASE_SERVICE_KEY !== 'undefined' ? process.env.SUPABASE_SERVICE_KEY : 'placeholder-key';const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
