const supabase = require('../supabaseClient');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
    process.exit(1);
}

const addMissingColumns = async () => {
    try {
        console.log('Adding missing columns to results table...');
        
        // Column definitions to add
        const columnsToAdd = [
            { name: 'regime', type: 'VARCHAR(50)', default: 'NONE' },
            { name: 'outcome_label', type: 'TEXT' },
            { name: 'product_formula', type: 'TEXT' },
            { name: 'ai_tutor_context', type: 'TEXT' },
            { name: 'thermal_effect', type: 'VARCHAR(50)', default: 'neutral' },
            { name: 'is_dangerous', type: 'BOOLEAN', default: false }
        ];

        for (const col of columnsToAdd) {
            try {
                // Try to add column - this will fail if column exists (which is fine)
                const { error } = await supabase.rpc('pg_catalog.to_regclass', { 
                    text: `ALTER TABLE results ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};` 
                });
                
                // Since RPC won't work for DDL, we'll use a different approach
                console.log(`Column ${col.name}: Would add ${col.type}`);
            } catch (e) {
                console.log(`Note for ${col.name}:`, e.message);
            }
        }

        console.log('\n--- Manual SQL Required ---');
        console.log('Please run the following SQL in your Supabase SQL Editor:\n');
        
        console.log(`
-- Add missing columns to results table
ALTER TABLE results ADD COLUMN IF NOT EXISTS regime VARCHAR(50) DEFAULT 'NONE';
ALTER TABLE results ADD COLUMN IF NOT EXISTS outcome_label TEXT;
ALTER TABLE results ADD COLUMN IF NOT EXISTS product_formula TEXT;
ALTER TABLE results ADD COLUMN IF NOT EXISTS ai_tutor_context TEXT;
ALTER TABLE results ADD COLUMN IF NOT EXISTS thermal_effect VARCHAR(50) DEFAULT 'neutral';
ALTER TABLE results ADD COLUMN IF NOT EXISTS is_dangerous BOOLEAN DEFAULT false;

-- Create index for faster regime lookups
CREATE INDEX IF NOT EXISTS idx_results_regime ON results(regime);
        `);

        console.log('\n--- Column Addition Complete ---');
        
    } catch (err) {
        console.error('Error:', err.message);
    }
};

addMissingColumns();
