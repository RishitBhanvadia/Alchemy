const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Validates the input parameters.
 * @param {Object} params - The request parameters.
 * @returns {Object} - Validation result { valid, message, status }.
 */
const validateInputs = (params) => {
    const paramNames = ['chem_a', 'chem_b', 'chem_c', 'chem_d'];
    for (const name of paramNames) {
        if (params[name] === undefined || params[name] === null) {
            return { valid: false, message: `Missing parameter: ${name}`, status: 400 };
        }
        const val = Number(params[name]);
        if (isNaN(val)) {
            return { valid: false, message: `Invalid number for: ${name}`, status: 400 };
        }
        if (val < 0 || val > 100) {
            return { valid: false, message: `Value out of range (0-100) for: ${name}`, status: 400 };
        }
    }
    return { valid: true };
};

/**
 * Calculates chemical statistics including normalization, rounding, and reaction ID.
 * @param {string|number} chem_a
 * @param {string|number} chem_b
 * @param {string|number} chem_c
 * @param {string|number} chem_d
 * @returns {Object} - { a, b, c, d, reaction_id }
 */
const calculateChemicalStats = (chem_a, chem_b, chem_c, chem_d) => {
    let a = Number(chem_a);
    let b = Number(chem_b);
    let c = Number(chem_c);
    let d = Number(chem_d);

    const sum = a + b + c + d;

    // Normalize if sum < 100
    if (sum < 100) {
        a = (a / sum) * 100;
        b = (b / sum) * 100;
        c = (c / sum) * 100;
        d = (d / sum) * 100;
    }

    // Round to nearest 10
    a = Math.round(a / 10) * 10;
    b = Math.round(b / 10) * 10;
    c = Math.round(c / 10) * 10;
    d = Math.round(d / 10) * 10;

    // Adjust rounding errors
    const finalSum = a + b + c + d;

    if (finalSum < 100) {
        const maxVal = Math.max(a, b, c, d);
        if (a === maxVal) a += 10;
        else if (b === maxVal) b += 10;
        else if (c === maxVal) c += 10;
        else d += 10;
    } else if (finalSum > 100) {
        // Treat 0 as a high value (1000) so it's not chosen as the minimum to subtract from
        const getMinVal = (val) => (val === 0 ? 1000 : val);
        const minVal = Math.min(getMinVal(a), getMinVal(b), getMinVal(c), getMinVal(d));

        if (a === minVal) a -= 10;
        else if (b === minVal) b -= 10;
        else if (c === minVal) c -= 10;
        else d -= 10;
    }

    // Calculate reaction_id
    let reaction_id = 0;
    if (a !== 0) reaction_id += 1;
    if (b !== 0) reaction_id += 10;
    if (c !== 0) reaction_id += 100;
    if (d !== 0) reaction_id += 1000;

    return { a, b, c, d, reaction_id };
};

exports.calculateResult = async (req, res) => {
    try {
        const validation = validateInputs(req.params);
        if (!validation.valid) {
            return res.status(validation.status).json({ message: validation.message });
        }

        const { chem_a, chem_b, chem_c, chem_d } = req.params;
        const stats = calculateChemicalStats(chem_a, chem_b, chem_c, chem_d);

        console.log(`Querying Supabase: A:${stats.a}, B:${stats.b}, C:${stats.c}, D:${stats.d}, ID:${stats.reaction_id}`);

        const { data, error } = await supabase
            .from('results')
            .select('*')
            .eq('conc_a', stats.a)
            .eq('conc_b', stats.b)
            .eq('conc_c', stats.c)
            .eq('conc_d', stats.d)
            .eq('reaction_id', stats.reaction_id);

        if (error) {
            console.error("Supabase Query Error:", error);
            return res.status(500).json({ message: "Database Error" });
        }

        res.json(data);

    } catch (error) {
        console.error("Error in calculateResult:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
