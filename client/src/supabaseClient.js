
import { createClient } from '@supabase/supabase-js';

const rawUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : undefined;
const rawKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : undefined;

const supabaseUrl = rawUrl || 'https://placeholder.supabase.co';
const supabaseKey = rawKey || 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder-key') {
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
}

// In case the variables evaluate to a string "undefined" or an empty string "", we provide an absolute fallback here:
export const supabase = createClient(
  (!supabaseUrl || supabaseUrl === 'undefined') ? 'https://placeholder.supabase.co' : supabaseUrl,
  (!supabaseKey || supabaseKey === 'undefined') ? 'placeholder-key' : supabaseKey
);
