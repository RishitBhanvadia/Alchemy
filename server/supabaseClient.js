const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'http://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || 'placeholder_key';

if (supabaseUrl === 'http://placeholder.supabase.co') {
  console.error('Missing Supabase credentials in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
