
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = '';
let supabaseKey = '';

try {
  supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
} catch (e) {
  // Ignore
}

if (!supabaseUrl || !supabaseKey) {
  supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
  supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

  if (supabaseUrl === 'https://placeholder.supabase.co') {
    // eslint-disable-next-line no-console
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey);
