const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const calculateConcentrations = (chem_a, chem_b, chem_c, chem_d) => {
    let a_val = chem_a;
    let b_val = chem_b;
    let c_val = chem_c;
    let d_val = chem_d;

    const add = a_val + b_val + c_val + d_val;

    // Normalize if sum < 100
    if (add < 100) {
        a_val = (a_val / add) * 100;
        b_val = (b_val / add) * 100;
        c_val = (c_val / add) * 100;
        d_val = (d_val / add) * 100;
    }

    let a = Math.round(a_val / 10) * 10;
    let b = Math.round(b_val / 10) * 10;
    let c = Math.round(c_val / 10) * 10;
    let d = Math.round(d_val / 10) * 10;

    // Adjust rounding errors if sum < 100 after rounding
    let final_add = a + b + c + d;
    while (final_add < 100) {
        const maxVal = Math.max(a, b, c, d);
        if (a === maxVal) a += 10;
        else if (b === maxVal) b += 10;
        else if (c === maxVal) c += 10;
        else d += 10;
        final_add += 10;
    }

    // Adjust rounding errors if sum > 100 after rounding
    while (final_add > 100) {
        const maxVal = Math.max(a, b, c, d);
        if (a === maxVal) a -= 10;
        else if (b === maxVal) b -= 10;
        else if (c === maxVal) c -= 10;
        else d -= 10;
        final_add -= 10;
    }

    return { a, b, c, d };
};

exports.calculateConcentrations = calculateConcentrations;

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

        const { a, b, c, d } = calculateConcentrations(chem_a, chem_b, chem_c, chem_d);

        // Calculate reaction_id hash
        let reaction_id = 0;
        if (a !== 0) reaction_id += 1;
        if (b !== 0) reaction_id += 10;
        if (c !== 0) reaction_id += 100;
        if (d !== 0) reaction_id += 1000;

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
