/* eslint-disable react/prop-types, no-console */

import { createClient } from '@supabase/supabase-js';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
let supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
    if (!supabaseUrl) supabaseUrl = 'https://placeholder.supabase.co';
    if (!supabaseKey) supabaseKey = 'placeholder_key';
}

export const supabase = createClient(supabaseUrl, supabaseKey);
