
import { createClient } from '@supabase/supabase-js';
import logger from './utils/logger';

let supabaseUrl = '';
let supabaseKey = '';

try {
  if (import.meta && import.meta.env) {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
} catch (e) {
  // Silent catch
}

if (!supabaseUrl) supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://placeholder.supabase.co';
if (!supabaseKey) supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';

if (supabaseUrl === 'http://placeholder.supabase.co') {
    logger.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
