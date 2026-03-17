
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'undefined' ? import.meta.env.VITE_SUPABASE_URL : 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.VITE_SUPABASE_ANON_KEY !== 'undefined' ? import.meta.env.VITE_SUPABASE_ANON_KEY : 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    // console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
