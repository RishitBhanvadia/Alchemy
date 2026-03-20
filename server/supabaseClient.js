const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables.');
}

// Ensure the URL is valid during CI where dummy values might be injected
const finalUrl = supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co';

const supabase = createClient(finalUrl, supabaseKey);

module.exports = supabase;
