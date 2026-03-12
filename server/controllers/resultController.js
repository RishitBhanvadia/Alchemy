const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ALX-016: Backend Response Caching
// Simple in-memory cache keyed by reaction_id + concentrations
const reactionCache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 60 minutes in ms

exports.calculateResult = async (req, res) => {
    try {
        const { chem_a: raw_a, chem_b: raw_b, chem_c: raw_c, chem_d: raw_d } = req.body;
        
        // ... parameter validation logic omitted for brevity in chunk but will be kept ...
        const params = ['chem_a', 'chem_b', 'chem_c', 'chem_d'];
        for (const param of params) {
            if (req.body[param] === undefined || req.body[param] === null) {
                return res.status(400).json({ message: `Missing parameter: ${param}` });
            }
            const val = Number(req.body[param]);
            if (isNaN(val)) {
                return res.status(400).json({ message: `Invalid number for: ${param}` });
            }
            if (val < 0 || val > 100) {
                return res.status(400).json({ message: `Value out of range (0-100) for: ${param}` });
            }
        }

        let chem_a = Number(req.body.chem_a);
        let chem_b = Number(req.body.chem_b);
        let chem_c = Number(req.body.chem_c);
        let chem_d = Number(req.body.chem_d);

        const add = chem_a + chem_b + chem_c + chem_d;

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

        // ALX-016: Cache Lookup
        const cacheKey = `${a}-${b}-${c}-${d}-${reaction_id}`;
        const cached = reactionCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            console.log(`Cache Hit for ${cacheKey}`);
            return res.json(cached.data);
        }

        console.log(`Querying Supabase: A:${a}, B:${b}, C:${c}, D:${d}, ID:${reaction_id}`);

        // Query Supabase
        let { data: item, error } = await supabase
            .from('results')
            .select('*')
            .eq('conc_a', a)
            .eq('conc_b', b)
            .eq('conc_c', c)
            .eq('conc_d', d)
            .eq('reaction_id', reaction_id)
            .single();

        // Fallback: Fuzzy lookup if exact match fails
        if (error || !item) {
            console.log(`Exact match failed for ID:${reaction_id}. Attempting fuzzy lookup with ±5 tolerance...`);
            
            const tolerance = 5;
            const { data: fuzzyData, error: fuzzyError } = await supabase
                .from('results')
                .select('*')
                .eq('reaction_id', reaction_id)
                .gte('conc_a', Math.max(0, a - tolerance))
                .lte('conc_a', Math.min(100, a + tolerance))
                .gte('conc_b', Math.max(0, b - tolerance))
                .lte('conc_b', Math.min(100, b + tolerance))
                .gte('conc_c', Math.max(0, c - tolerance))
                .lte('conc_c', Math.min(100, c + tolerance))
                .gte('conc_d', Math.max(0, d - tolerance))
                .lte('conc_d', Math.min(100, d + tolerance))
                .limit(1);

            if (!fuzzyError && fuzzyData && fuzzyData.length > 0) {
                item = fuzzyData[0];
                console.log(`Fuzzy match found: ${item.outcome}`);
            } else {
                console.error("Supabase Query Error (Exact & Fuzzy) or No Data:", error || fuzzyError);
                return res.status(404).json({ error: 'No reaction found for these inputs.' });
            }
        }

        // Map Supabase fields to frontend expected fields
        const mappedData = {
            ...item,
            product_name: item.product_name || item.outcome || "Unknown Product",
            product_info: item.product_info || item.result_formula || "No details available",
            product_properties: Array.isArray(item.product_properties) ? item.product_properties : 
                               Array.isArray(item.characteristics) ? item.characteristics : [],
            product_uses: Array.isArray(item.product_uses) ? item.product_uses : []
        };

        // ALX-016: Store in Cache
        reactionCache.set(cacheKey, {
            timestamp: Date.now(),
            data: mappedData
        });

        // Return mapped data
        res.json(mappedData);

        // Log the experiment result for analytics if student_id is provided
        try {
            const student_id = req.body.student_id;
            if (student_id) {
                console.log(`Logging experiment for student: ${student_id}`);
                await supabase
                    .from('experiment_results')
                    .insert([{
                        user_id: student_id,
                        experiment_type: req.body.experiment_type || 'inorganic',
                        chem_a: a,
                        chem_b: b,
                        chem_c: c,
                        chem_d: d,
                        result_name: mappedData.product_name,
                        result_formula: mappedData.product_info,
                        details: {
                            raw_conc: { chem_a: Number(req.body.chem_a), chem_b: Number(req.body.chem_b), chem_c: Number(req.body.chem_c), chem_d: Number(req.body.chem_d) },
                            reaction_id: reaction_id
                        }
                    }]);
            }
        } catch (logErr) {
            console.error("Error logging experiment outcome:", logErr);
        }

    } catch (error) {
        console.error("Error in calculateResult:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
