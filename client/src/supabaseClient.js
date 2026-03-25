
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = '';
let supabaseKey = '';

try {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  }
} catch (error) {
  // Ignore import.meta.env errors in testing environments
}

// Fallback to process.env for Node.js test environments
if (!supabaseUrl && typeof process !== 'undefined' && process.env) {
  supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
}

// Provide valid dummy strings to avoid fatal createClient errors
if (!supabaseUrl || !supabaseKey) {
    // eslint-disable-next-line no-console
    console.warn(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Using dummy values to prevent fatal crash.'
    );
    supabaseUrl = 'https://placeholder.supabase.co';
    supabaseKey = 'placeholder_key';
}

export const supabase = createClient(supabaseUrl, supabaseKey);
