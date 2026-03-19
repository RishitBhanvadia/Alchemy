
import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = rawUrl !== 'undefined' && rawUrl?.startsWith('http') ? rawUrl : 'https://placeholder.supabase.co';
const supabaseKey = rawKey !== 'undefined' && rawKey ? rawKey : 'placeholder-key';

if (!rawUrl || !rawKey || rawUrl === 'undefined' || rawKey === 'undefined') {
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
