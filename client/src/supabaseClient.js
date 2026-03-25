
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = 'https://placeholder.supabase.co';
let supabaseKey = 'placeholder';

try {
    if (import.meta && import.meta.env) {
        supabaseUrl = import.meta.env.VITE_SUPABASE_URL || supabaseUrl;
        supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || supabaseKey;
    }
} catch (error) {
    // Fallback to process.env if import.meta.env is unavailable (e.g., in some test environments)
    if (typeof process !== 'undefined' && process.env) {
        supabaseUrl = process.env.VITE_SUPABASE_URL || supabaseUrl;
        supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || supabaseKey;
    }
}

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder') {
    // eslint-disable-next-line no-console
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Using placeholders to prevent startup crashes.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
