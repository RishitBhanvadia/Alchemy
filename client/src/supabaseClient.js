import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'undefined' || !String(supabaseUrl).startsWith('http')) {
    supabaseUrl = 'https://placeholder.supabase.co';
}

if (!supabaseKey || supabaseKey === 'undefined') {
    supabaseKey = 'placeholder-key';
}

if (supabaseUrl === 'https://placeholder.supabase.co') {
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
