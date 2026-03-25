
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
  try {
    supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  } catch (e) {
    // Ignore
  }
}

if (!supabaseUrl || !supabaseKey) {
  supabaseUrl = 'https://placeholder.supabase.co';
  supabaseKey = 'placeholder';

  // eslint-disable-next-line no-console
  console.error(
      'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
      'Authentication will not work. Please set them in your environment or .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
