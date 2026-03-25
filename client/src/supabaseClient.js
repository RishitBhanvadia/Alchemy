
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = 'https://placeholder.supabase.co';
let supabaseKey = 'placeholder';

try {
    if (import.meta && import.meta.env) {
        supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
        supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
    }
} catch (e) {
    if (typeof process !== 'undefined' && process.env) {
        supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
        supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
    }
}

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder') {
    // eslint-disable-next-line no-console
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
