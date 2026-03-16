import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('titration_data')
      .select('*');

    if (error) {
      console.error("Supabase Query Error:", error);
      return res.status(500).json({ message: "Database Error" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error in getTitrationData:", error);
    res.status(500).json({ message: "Server Error" });
  }
}
