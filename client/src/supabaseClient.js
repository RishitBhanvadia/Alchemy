
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://madcquepligcvwkfycud.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZGNxdWVwbGlnY3Z3a2Z5Y3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzODczMDAsImV4cCI6MjA4NTk2MzMwMH0.aWmtm0ZWFuneMkZuAmydXsbWzdNpsQ9Qy0TLX8SEkRk';

export const supabase = createClient(supabaseUrl, supabaseKey);
