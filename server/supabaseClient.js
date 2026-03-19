const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'undefined' ? process.env.SUPABASE_SERVICE_ROLE_KEY : 'placeholder-key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in environment variables.');
}

const supabase = process.env.NODE_ENV === 'test' || !process.env.SUPABASE_URL?.startsWith('http')
    ? createClient('https://placeholder.supabase.co', 'placeholder-key')
    : createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
