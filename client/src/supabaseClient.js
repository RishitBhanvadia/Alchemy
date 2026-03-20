
import { createClient } from '@supabase/supabase-js';

const _url = import.meta.env.VITE_SUPABASE_URL;
const _key = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isUrlValid = typeof _url === 'string' && _url.trim() !== '' && _url !== 'undefined';
const isKeyValid = typeof _key === 'string' && _key.trim() !== '' && _key !== 'undefined';

const supabaseUrl = isUrlValid ? _url : 'https://placeholder.supabase.co';
const supabaseKey = isKeyValid ? _key : 'placeholder-key';

if (!isUrlValid || !isKeyValid) {
    console.error(
        'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). ' +
        'Authentication will not work. Please set them in your environment or .env.local file.'
    );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
