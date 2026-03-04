const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Credentials should never be hardcoded
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const migrate = async () => {
    try {
        const dataPath = path.join(__dirname, '../data/results.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const localData = JSON.parse(rawData);

        console.log(`Read ${localData.length} records from JSON.`);

        // Transform data to match Supabase schema
        // Specifically parsing stringified arrays in 'product_properties' and 'product_uses'
        const formattedData = localData.map(item => {

            const parseArrayField = (field) => {
                if (typeof field === 'string') {
                    try {
                        const validJson = field.replace(/'/g, '"');
                        return JSON.parse(validJson);
                    } catch (e) {
                        // Fallback for simple comma separated list or just return empty
                        return [];
                    }
                }
                return field || [];
            };

            return {
                reaction_id: item.reaction_id,
                conc_a: item.conc_a,
                conc_b: item.conc_b,
                conc_c: item.conc_c,
                conc_d: item.conc_d,
                color: item.color,
                solid: item.solid,
                solid_color: item.solid_color,
                gas: item.gas,
                gas_color: item.gas_color,
                smell: item.smell || "", // Handle potential missing fields
                result: item.result,
                product_name: item.product_name,
                product_info: item.product_info,
                product_properties: parseArrayField(item.product_properties),
                product_uses: parseArrayField(item.product_uses)
            };
        });

        const { data, error } = await supabase
            .from('results')
            .insert(formattedData);

        if (error) {
            console.error('Migration Error:', error);
        } else {
            console.log('Successfully migrated data to Supabase!');
        }

    } catch (err) {
        console.error('Script Error:', err);
    }
};

migrate();
