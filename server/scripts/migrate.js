const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Credentials provided by user for migration only
const SUPABASE_URL = 'https://madcquepligcvwkfycud.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZGNxdWVwbGlnY3Z3a2Z5Y3VkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM4NzMwMCwiZXhwIjoyMDg1OTYzMzAwfQ.alfgbAhbrxP7Y25qrlmY-3D6uUAsK5PAyYjAW4_ygQU';

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
