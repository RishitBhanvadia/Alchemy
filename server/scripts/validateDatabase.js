const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const supabase = require('../supabaseClient');
const supabaseUrl = process.env.SUPABASE_URL;

const ALLOWED_OUTCOMES = [
  'No Reaction', 'Neutralisation / Salt Water',
  'Precipitate (White)', 'Precipitate (Yellow)',
  'Gas Evolution (CO2 Bubble)', 'Exothermic Reaction (Heat + Light)',
  'Colour Change (Blue -> Green)', 'Explosion (Vigorous)',
  'Complex Equilibrium', 'Multi-phase Reaction',
  'Pure Chemical A (No Reaction)', 'Pure Chemical B (No Reaction)',
  'Pure Chemical C (No Reaction)', 'Pure Chemical D (No Reaction)',
  'Acidic Salt Solution', 'Basic Salt Solution'
];

async function validateDatabase() {
  console.log('--- Starting Database Validation ---');
  console.log(`Connecting to: ${supabaseUrl}`);

  try {
    const { data: rows, error } = await supabase
      .from('results')
      .select('*');

    if (error) {
      console.error('Error fetching data from Supabase:', error.message);
      return;
    }

    if (!rows || rows.length === 0) {
      console.log('No rows found in the "results" table.');
      return;
    }

    let passedCount = 0;
    let failedCount = 0;

    rows.forEach((row, index) => {
      const violations = [];

      // (a) conc_a + conc_b + conc_c + conc_d === 100
      const a = Number(row.conc_a) || 0;
      const b = Number(row.conc_b) || 0;
      const c = Number(row.conc_c) || 0;
      const d = Number(row.conc_d) || 0;
      const sum = a + b + c + d;
      
      if (Math.abs(sum - 100) > 0.01) {
        violations.push(`Concentrations sum to ${sum}, expected 100 (A:${a}, B:${b}, C:${c}, D:${d})`);
      }

      // (b) reaction_id matches the formula
      // A present = +1, B present = +10, C present = +100, D present = +1000
      let expectedId = 0;
      if (a > 0) expectedId += 1;
      if (b > 0) expectedId += 10;
      if (c > 0) expectedId += 100;
      if (d > 0) expectedId += 1000;

      if (Number(row.reaction_id) !== expectedId) {
        violations.push(`reaction_id is ${row.reaction_id}, expected ${expectedId}`);
      }

      // (c) outcome is a non-empty string from the allowed list
      if (!row.outcome || typeof row.outcome !== 'string' || row.outcome.trim() === '') {
        violations.push('outcome is empty or invalid');
      } else if (!ALLOWED_OUTCOMES.includes(row.outcome)) {
        violations.push(`outcome "${row.outcome}" is not in the allowed list`);
      }

      if (violations.length === 0) {
        console.log(`Row ${index + 1} (Outcome: ${row.outcome}): PASS`);
        passedCount++;
      } else {
        console.log(`Row ${index + 1} (Outcome: ${row.outcome || 'N/A'}): FAIL`);
        violations.forEach(v => console.log(`  - Violation: ${v}`));
        failedCount++;
      }
    });

    console.log('\n--- Validation Summary ---');
    console.log(`Total rows checked: ${rows.length}`);
    console.log(`Passed: ${passedCount}`);
    console.log(`Failed: ${failedCount}`);
    
    if (failedCount === 0) {
      console.log('Result: SUCCESS - Database is valid.');
    } else {
      console.log('Result: FAILURE - Database has integrity issues.');
    }
  } catch (err) {
    console.error('An unexpected error occurred during validation:', err);
  }
}

validateDatabase();
