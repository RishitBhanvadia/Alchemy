
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'undefined' && import.meta.env.VITE_SUPABASE_URL.startsWith('http') ? import.meta.env.VITE_SUPABASE_URL : 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY !== 'undefined' ? import.meta.env.VITE_SUPABASE_ANON_KEY : 'placeholder-key';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseKey === 'placeholder-key') {
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
