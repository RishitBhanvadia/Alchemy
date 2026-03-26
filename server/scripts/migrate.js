const supabase = require('../supabaseClient');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


function classifyRegime(conc_a, conc_b) {
    const acidBaseSum = conc_a + conc_b;
    if (acidBaseSum > 0) {
        const ratio = conc_a / acidBaseSum;
        if (ratio > 0.65) return 'ACID_DOMINANT';
        if (ratio < 0.35) return 'BASE_DOMINANT';
        return 'NEUTRAL';
    }
    return 'NONE';
}

function deriveThermalEffect(result) {
    if (!result) return 'neutral';
    const r = result.toLowerCase();
    if (r.includes('exothermic') || r.includes('heat') || r.includes('light')) return 'exothermic';
    if (r.includes('endothermic') || r.includes('cold')) return 'endothermic';
    if (r.includes('cl2') || r.includes('chlorine')) return 'exothermic';
    return 'neutral';
}

function determineDanger(result, gas) {
    if (!result) return false;
    const r = result.toLowerCase();
    const dangerous = ['cl2', 'chlorine', 'explosion', 'vigorous', 'hcl', 'hazard', 'conc.'];
    return dangerous.some(d => r.includes(d)) || (gas && r.includes('gas'));
}

const migrate = async () => {
    try {
        const dataPath = path.join(__dirname, '../data/results.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const localData = JSON.parse(rawData);

        console.log(`Read ${localData.length} records from JSON.`);

        // Get unique reaction_id + regime combinations from JSON
        const uniqueRecords = new Map();
        
        for (const item of localData) {
            const key = `${item.reaction_id}`;
            if (!uniqueRecords.has(key)) {
                const regime = classifyRegime(item.conc_a, item.conc_b);
                const thermalEffect = deriveThermalEffect(item.result);
                const isDangerous = determineDanger(item.result, item.gas);
                
                // Build state_change from solid/gas
                const stateChanges = [];
                if (item.solid) stateChanges.push('Precipitate');
                if (item.gas) stateChanges.push('Gas Evolution');
                
                uniqueRecords.set(key, {
                    reaction_id: item.reaction_id,
                    regime: regime,
                    outcome_label: item.result || 'No Reaction',
                    product_formula: item.product_name || '',
                    color: item.color || '#ffffff',
                    state_change: stateChanges.length > 0 ? stateChanges.join(', ') : 'None',
                    thermal_effect: thermalEffect,
                    ai_tutor_context: item.product_info || item.result || '',
                    is_dangerous: isDangerous
                });
            }
        }

        const formattedData = Array.from(uniqueRecords.values());
        console.log(`Transformed to ${formattedData.length} unique reaction records.`);
        console.log('Sample record:', JSON.stringify(formattedData[0], null, 2));

        // Delete existing records that we'll replace
        const reactionIds = formattedData.map(r => r.reaction_id);
        await supabase.from('results').delete().in('reaction_id', reactionIds);

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
