
import { createClient } from '@supabase/supabase-js';

const envUrl = (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : null);
const envKey = (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : null);

const supabaseUrl = (envUrl && envUrl.trim() !== '') ? envUrl : 'https://placeholder.supabase.co';
const supabaseKey = (envKey && envKey.trim() !== '') ? envKey : 'placeholder';

if (!envUrl || !envKey) {
    // eslint-disable-next-line no-console
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
