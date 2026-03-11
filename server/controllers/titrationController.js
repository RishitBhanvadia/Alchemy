const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.getTitrationData = async (req, res) => {
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
};
