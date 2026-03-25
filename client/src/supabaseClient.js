
import { createClient } from '@supabase/supabase-js';

let supabaseUrl = '';
let supabaseKey = '';

let isTestEnv = false;

try {
    if (import.meta && import.meta.env) {
        isTestEnv = import.meta.env.MODE === 'test';
        supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (isTestEnv ? 'https://placeholder.supabase.co' : '');
        supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (isTestEnv ? 'placeholder' : '');
    }
} catch (e) {
    // ignore
}

if (!supabaseUrl) {
    isTestEnv = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test';
    supabaseUrl = (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_URL) || (isTestEnv ? 'https://placeholder.supabase.co' : '');
}
if (!supabaseKey) {
    supabaseKey = (typeof process !== 'undefined' && process.env && process.env.VITE_SUPABASE_ANON_KEY) || (isTestEnv ? 'placeholder' : '');
}

if (!supabaseUrl || !supabaseKey) {
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
