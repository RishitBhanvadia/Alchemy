
/**
 * Calculates and normalizes chemical concentrations.
 *
 * Logic:
 * 1. Validates inputs are numbers 0-100.
 * 2. If sum < 100, normalizes concentrations to sum to 100.
 * 3. Rounds to nearest 10.
 * 4. Adjusts for rounding errors to ensure sum is exactly 100.
 *
 * @param {Object} params - Object containing chem_a, chem_b, chem_c, chem_d
 * @returns {Object} - Object containing normalized concentrations a, b, c, d and reaction_id
 * @throws {Error} - If inputs are invalid
 */
function calculateConcentrations({ chem_a, chem_b, chem_c, chem_d }) {
    // Basic validation
    const params = [chem_a, chem_b, chem_c, chem_d];
    for (const val of params) {
        if (typeof val !== 'number' || isNaN(val)) {
            throw new Error('Invalid number input');
        }
        if (val < 0 || val > 100) {
            throw new Error('Value out of range (0-100)');
        }
    }

    let a_val = chem_a;
    let b_val = chem_b;
    let c_val = chem_c;
    let d_val = chem_d;

    const sum = a_val + b_val + c_val + d_val;

    // Handle all zeros case specifically to avoid NaN
    if (sum === 0) {
        return {
            a: 0,
            b: 0,
            c: 0,
            d: 0,
            reaction_id: 0
        };
    }

    // Normalize if sum < 100
    // Logic: if user provides 10, 10, 10, 10 (sum 40), treat as 25% each.
    if (sum < 100) {
        a_val = (a_val / sum) * 100;
        b_val = (b_val / sum) * 100;
        c_val = (c_val / sum) * 100;
        d_val = (d_val / sum) * 100;
    }

    let a = Math.round(a_val / 10) * 10;
    let b = Math.round(b_val / 10) * 10;
    let c = Math.round(c_val / 10) * 10;
    let d = Math.round(d_val / 10) * 10;

    // Iteratively adjust sum to 100
    // We use a loop to handle cases where error > 10 (e.g. 30+30+30+30 = 120)
    let final_add = a + b + c + d;

    // Safety break to prevent infinite loops (though strictly not reachable with this logic)
    let iterations = 0;
    while (final_add !== 100 && iterations < 10) {
        if (final_add < 100) {
            // Add to the largest value to preserve the dominant chemical
            const maxVal = Math.max(a, b, c, d);
            if (a === maxVal) a += 10;
            else if (b === maxVal) b += 10;
            else if (c === maxVal) c += 10;
            else d += 10;
        } else {
            // Subtract from the largest value to reduce error while keeping ratios closest
            // (Previous logic subtracted from min, which caused imbalances)
            const maxVal = Math.max(a, b, c, d);
            if (a === maxVal) a -= 10;
            else if (b === maxVal) b -= 10;
            else if (c === maxVal) c -= 10;
            else d -= 10;
        }
        final_add = a + b + c + d;
        iterations++;
    }

    // Calculate reaction_id hash
    let reaction_id = 0;
    if (a !== 0) reaction_id += 1;
    if (b !== 0) reaction_id += 10;
    if (c !== 0) reaction_id += 100;
    if (d !== 0) reaction_id += 1000;

    return { a, b, c, d, reaction_id };
}

module.exports = { calculateConcentrations };
