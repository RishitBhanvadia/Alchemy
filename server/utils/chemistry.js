/**
 * Validates the chemical parameters.
 * @param {object} params - The request parameters object.
 * @returns {object} - An object with { valid: boolean, message: string }
 */
const validateParams = (params) => {
    const requiredParams = ['chem_a', 'chem_b', 'chem_c', 'chem_d'];
    for (const param of requiredParams) {
        if (params[param] === undefined || params[param] === null) {
            return { valid: false, message: `Missing parameter: ${param}` };
        }
        const val = Number(params[param]);
        if (isNaN(val)) {
            return { valid: false, message: `Invalid number for: ${param}` };
        }
        if (val < 0 || val > 100) {
            return { valid: false, message: `Value out of range (0-100) for: ${param}` };
        }
    }
    return { valid: true };
};

/**
 * Calculates the normalized chemical values and reaction ID.
 * @param {number} chem_a
 * @param {number} chem_b
 * @param {number} chem_c
 * @param {number} chem_d
 * @returns {object} - An object containing normalized values { a, b, c, d, reaction_id }.
 */
const calculateValues = (chem_a, chem_b, chem_c, chem_d) => {
    // Ensure inputs are numbers
    let a_raw = Number(chem_a);
    let b_raw = Number(chem_b);
    let c_raw = Number(chem_c);
    let d_raw = Number(chem_d);

    const add = a_raw + b_raw + c_raw + d_raw;

    // Normalize if sum < 100 and sum > 0 (to avoid division by zero)
    if (add < 100 && add > 0) {
        a_raw = (a_raw / add) * 100;
        b_raw = (b_raw / add) * 100;
        c_raw = (c_raw / add) * 100;
        d_raw = (d_raw / add) * 100;
    }

    // Round to nearest 10
    let a = Math.round(a_raw / 10) * 10;
    let b = Math.round(b_raw / 10) * 10;
    let c = Math.round(c_raw / 10) * 10;
    let d = Math.round(d_raw / 10) * 10;

    // Adjust rounding errors if sum < 100 after rounding
    let final_add = a + b + c + d;
    if (final_add < 100 && final_add > 0) {
        // Find max value to add the difference to
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

    return { a, b, c, d, reaction_id };
};

module.exports = {
    validateParams,
    calculateValues
};
