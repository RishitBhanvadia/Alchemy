const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.calculateResult = async (req, res) => {
    try {
        const params = ['chem_a', 'chem_b', 'chem_c', 'chem_d'];
        for (const param of params) {
            if (req.params[param] === undefined || req.params[param] === null) {
                return res.status(400).json({ message: `Missing parameter: ${param}` });
            }
            const val = Number(req.params[param]);
            if (isNaN(val)) {
                return res.status(400).json({ message: `Invalid number for: ${param}` });
            }
            if (val < 0 || val > 100) {
                return res.status(400).json({ message: `Value out of range (0-100) for: ${param}` });
            }
        }

        let chem_a = Number(req.params.chem_a);
        let chem_b = Number(req.params.chem_b);
        let chem_c = Number(req.params.chem_c);
        let chem_d = Number(req.params.chem_d);

        const add = chem_a + chem_b + chem_c + chem_d;

        if (add === 0) {
            return res.status(400).json({ message: "Total concentration cannot be zero" });
        }

        // Normalize if sum < 100
        if (add < 100) {
            chem_a = (chem_a / add) * 100;
            chem_b = (chem_b / add) * 100;
            chem_c = (chem_c / add) * 100;
            chem_d = (chem_d / add) * 100;
        }

        let a = Math.round(chem_a / 10) * 10;
        let b = Math.round(chem_b / 10) * 10;
        let c = Math.round(chem_c / 10) * 10;
        let d = Math.round(chem_d / 10) * 10;

        // Adjust rounding errors if sum < 100 after rounding
        let final_add = a + b + c + d;
        if (final_add < 100) {
            const maxVal = Math.max(a, b, c, d);
            if (a === maxVal) a += 10;
            else if (b === maxVal) b += 10;
            else if (c === maxVal) c += 10;
            else d += 10;
        }

        // Adjust rounding errors if sum > 100 after rounding
        if (final_add > 100) {
            let for_min_a = (a === 0) ? 1000 : a;
            let for_min_b = (b === 0) ? 1000 : b;
            let for_min_c = (c === 0) ? 1000 : c;
            let for_min_d = (d === 0) ? 1000 : d;

            const minVal = Math.min(for_min_a, for_min_b, for_min_c, for_min_d);

            if (a === minVal) a -= 10;
            else if (b === minVal) b -= 10;
            else if (c === minVal) c -= 10;
            else d -= 10;
        }

        // Calculate reaction_id hash
        let reaction_id = 0;
        if (a !== 0) reaction_id += 1;
        if (b !== 0) reaction_id += 10;
        if (c !== 0) reaction_id += 100;
        if (d !== 0) reaction_id += 1000;

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
