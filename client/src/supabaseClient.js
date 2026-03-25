
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = 'https://placeholder.supabase.co';
let supabaseKey = 'placeholder';

try {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || supabaseUrl;
    supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || supabaseKey;
} catch (e) {
    supabaseUrl = process.env.VITE_SUPABASE_URL || supabaseUrl;
    supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || supabaseKey;
}

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder') {
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
