const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

let envUrl = process.env.SUPABASE_URL;
let envKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (envUrl === 'undefined') envUrl = '';
if (envKey === 'undefined') envKey = '';

const supabaseUrl = envUrl && envUrl.startsWith('http') ? envUrl : 'https://placeholder.supabase.co';
const supabaseKey = envKey || 'placeholder-key';

if (!envUrl || !envKey) {
  console.error('Missing Supabase credentials in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
