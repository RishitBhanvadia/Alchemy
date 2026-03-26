import { createClient } from '@supabase/supabase-js';

let supabaseUrl = '';
let supabaseKey = '';

try {
  if (import.meta && import.meta.env) {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  }
} catch (e) {
  // Ignore
}

if (!supabaseUrl) supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://placeholder.supabase.co';
if (!supabaseKey) supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

if (supabaseUrl === 'http://placeholder.supabase.co' || supabaseKey === 'placeholder_key') {
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
