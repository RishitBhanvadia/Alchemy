const { createClient } = require('@supabase/supabase-js');
const { calculateConcentrations } = require('../utils/chemistry');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.calculateResult = async (req, res) => {
    try {
        const chem_a = Number(req.params.chem_a);
        const chem_b = Number(req.params.chem_b);
        const chem_c = Number(req.params.chem_c);
        const chem_d = Number(req.params.chem_d);

        let result;
        try {
            result = calculateConcentrations({ chem_a, chem_b, chem_c, chem_d });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        const { a, b, c, d, reaction_id } = result;

        console.log(`Querying Supabase: A:${a}, B:${b}, C:${c}, D:${d}, ID:${reaction_id}`);

        // Query Supabase
        const { data, error } = await supabase
            .from('results')
            .select('*')
            .eq('conc_a', a)
            .eq('conc_b', b)
            .eq('conc_c', c)
            .eq('conc_d', d)
            .eq('reaction_id', reaction_id);

        if (error) {
            console.error("Supabase Query Error:", error);
            return res.status(500).json({ message: "Database Error" });
        }

        // Return data directly (Supabase returns an array, which matches our API response format)
        res.json(data);

    } catch (error) {
        console.error("Error in calculateResult:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
