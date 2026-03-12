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

        // Normalize if sum < 100
        if (add > 0 && add < 100) {
            chem_a = (chem_a / add) * 100;
            chem_b = (chem_b / add) * 100;
            chem_c = (chem_c / add) * 100;
            chem_d = (chem_d / add) * 100;
        } else if (add === 0) {
            chem_a = 0;
            chem_b = 0;
            chem_c = 0;
            chem_d = 0;
        }

        let a = Math.round(chem_a / 10) * 10;
        let b = Math.round(chem_b / 10) * 10;
        let c = Math.round(chem_c / 10) * 10;
        let d = Math.round(chem_d / 10) * 10;

        let final_add = a + b + c + d;

        let diff = final_add - 100;
        if (diff > 0 && final_add > 0) {
            let arr = [
                {name: 'a', rounded: a, original: chem_a},
                {name: 'b', rounded: b, original: chem_b},
                {name: 'c', rounded: c, original: chem_c},
                {name: 'd', rounded: d, original: chem_d}
            ].sort((x, y) => (y.rounded - y.original) - (x.rounded - x.original));

            let count = diff / 10;
            for (let i = 0; count > 0; i = (i + 1) % arr.length) {
                if (arr[i].rounded > 0) {
                    arr[i].rounded -= 10;
                    count--;
                }
            }
            a = arr.find(x => x.name === 'a').rounded;
            b = arr.find(x => x.name === 'b').rounded;
            c = arr.find(x => x.name === 'c').rounded;
            d = arr.find(x => x.name === 'd').rounded;
        } else if (diff < 0 && final_add > 0) {
            let arr = [
                {name: 'a', rounded: a, original: chem_a},
                {name: 'b', rounded: b, original: chem_b},
                {name: 'c', rounded: c, original: chem_c},
                {name: 'd', rounded: d, original: chem_d}
            ].sort((x, y) => (x.rounded - x.original) - (y.rounded - y.original));

            let count = Math.abs(diff) / 10;
            let validIndices = arr.map((val, idx) => val.original > 0 ? idx : -1).filter(idx => idx !== -1);
            if (validIndices.length === 0) validIndices = [0]; // fallback

            let i = 0;
            while(count > 0) {
                arr[validIndices[i % validIndices.length]].rounded += 10;
                count--;
                i++;
            }
            a = arr.find(x => x.name === 'a').rounded;
            b = arr.find(x => x.name === 'b').rounded;
            c = arr.find(x => x.name === 'c').rounded;
            d = arr.find(x => x.name === 'd').rounded;
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

        // Map Supabase fields to frontend expected fields
        const mappedData = data.map(item => ({
            ...item,
            product_name: item.product_name || item.result_name || "Unknown Product",
            product_info: item.product_info || item.result_formula || "No details available",
            product_properties: Array.isArray(item.product_properties) ? item.product_properties : 
                               Array.isArray(item.characteristics) ? item.characteristics : [],
            product_uses: Array.isArray(item.product_uses) ? item.product_uses : []
        }));

        // Return mapped data
        res.json(mappedData);

    } catch (error) {
        console.error("Error in calculateResult:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
