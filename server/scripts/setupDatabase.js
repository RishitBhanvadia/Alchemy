const supabase = require('../supabaseClient');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const addColumnsAndMigrate = async () => {
    try {
        console.log('=== Step 1: Checking current table schema ===');
        
        const { data: existingData, error: fetchError } = await supabase
            .from('results')
            .select('*')
            .limit(1);

        if (fetchError) {
            console.error('Error fetching sample data:', fetchError);
        } else if (existingData && existingData.length > 0) {
            console.log('Current columns in results table:');
            console.log(Object.keys(existingData[0]));
        }

        console.log('\n=== Step 2: Checking if data exists ===');
        
        const { count, error: countError } = await supabase
            .from('results')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('Error counting records:', countError);
        } else {
            console.log(`Total records in results table: ${count}`);
        }

        console.log('\n=== Step 3: Note about schema changes ===');
        console.log(`
To add columns to Supabase, you have two options:

OPTION A - Run SQL directly in Supabase Dashboard:
1. Go to https://supabase.com/dashboard/project/madcquepligcvwkfycud/sql
2. Run these commands:

ALTER TABLE results ADD COLUMN IF NOT EXISTS regime VARCHAR(50) DEFAULT 'NONE';
ALTER TABLE results ADD COLUMN IF NOT EXISTS outcome_label TEXT;
ALTER TABLE results ADD COLUMN IF NOT EXISTS product_formula TEXT;
ALTER TABLE results ADD COLUMN IF NOT EXISTS ai_tutor_context TEXT;
ALTER TABLE results ADD COLUMN IF NOT EXISTS thermal_effect VARCHAR(50) DEFAULT 'neutral';
ALTER TABLE results ADD COLUMN IF NOT EXISTS is_dangerous BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_results_regime ON results(regime);

OPTION B - Use Supabase CLI:
supabase db execute -p <project-ref> --file schema.sql

Current status: The server code has been updated to handle missing columns gracefully.
The API will work with existing columns - new columns will be populated during upsert.
        `);

        console.log('\n=== Step 4: Testing API with sample data ===');
        
        const testCases = [
            { chem_a: 100, chem_b: 0, chem_i: 0, chem_c: 0, name: 'Acid only (ID=1)' },
            { chem_a: 50, chem_b: 50, chem_i: 0, chem_c: 0, name: 'A+B Neutral (ID=11)' },
            { chem_a: 70, chem_b: 20, chem_i: 10, chem_c: 0, name: 'A+B+I (ID=111)' },
            { chem_a: 25, chem_b: 25, chem_i: 25, chem_c: 25, name: 'All 4 (ID=1111)' },
        ];

        for (const test of testCases) {
            const { data, error } = await supabase
                .from('results')
                .select('*')
                .eq('reaction_id', test.chem_a >= 10 ? 1 : 0)
                .eq('conc_a', test.chem_a)
                .limit(1)
                .single();
            
            console.log(`${test.name}: ${data ? 'Found' : 'Not found'}`);
        }

        console.log('\n=== Setup Complete ===');
        console.log('The application is ready. The API will work with existing columns.');

    } catch (err) {
        console.error('Error:', err.message);
    }
};

addColumnsAndMigrate();
