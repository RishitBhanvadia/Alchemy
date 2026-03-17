const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder-key') {
  console.error('Missing Supabase credentials in environment variables.');
}

const finalUrl = (!supabaseUrl || supabaseUrl === 'undefined') ? 'https://placeholder.supabase.co' : supabaseUrl;
const finalKey = (!supabaseKey || supabaseKey === 'undefined') ? 'placeholder-key' : supabaseKey;

const supabase = createClient(finalUrl, finalKey);

module.exports = supabase;
