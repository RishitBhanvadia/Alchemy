
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate URL and Key (ensure they are not placeholders like 'placeholder')
const isValid = supabaseUrl && 
                supabaseKey && 
                !supabaseUrl.includes('placeholder') && 
                supabaseKey !== 'placeholder';

if (!isValid) {
    if (import.meta.env.MODE !== 'test') { // Only warn in development/production
                // console.warn('⚠️ Missing or invalid Supabase environment variables. Authentication features will be disabled. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.');
    }
}

export const supabase = isValid ? createClient(supabaseUrl, supabaseKey) : null;
