
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = '';
let supabaseKey = '';

try {
    if (import.meta && import.meta.env) {
        supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    }
} catch (e) {
    // In test environments where import.meta.env is not fully available, fallback
}

supabaseUrl = supabaseUrl || 'https://placeholder.supabase.co';
supabaseKey = supabaseKey || 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder') {
    // eslint-disable-next-line no-console
    console.warn(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Falling back to placeholder values.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
