
exports.validateInputs = (params) => {
    const { chem_a, chem_b, chem_c, chem_d } = params;
    const inputs = [chem_a, chem_b, chem_c, chem_d];

    for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i];
        if (val === undefined || val === null) {
            return { isValid: false, message: 'Missing parameter' };
        }
        const num = Number(val);
        if (isNaN(num)) {
            return { isValid: false, message: 'Invalid number' };
        }
        if (num < 0 || num > 100) {
            return { isValid: false, message: 'Value out of range (0-100)' };
        }
    }
    return { isValid: true };
};

exports.calculateConcentrations = (chem_a, chem_b, chem_c, chem_d) => {
    let a = Number(chem_a);
    let b = Number(chem_b);
    let c = Number(chem_c);
    let d = Number(chem_d);

    const add = a + b + c + d;

    // Normalize if sum < 100
    if (add < 100 && add > 0) {
        a = (a / add) * 100;
        b = (b / add) * 100;
        c = (c / add) * 100;
        d = (d / add) * 100;
    }

    // Round to nearest 10
    a = Math.round(a / 10) * 10;
    b = Math.round(b / 10) * 10;
    c = Math.round(c / 10) * 10;
    d = Math.round(d / 10) * 10;

    // Adjust rounding errors if sum < 100 after rounding
    let final_add = a + b + c + d;
    if (final_add < 100 && final_add > 0) {
        const maxVal = Math.max(a, b, c, d);
        if (a === maxVal) a += 10;
        else if (b === maxVal) b += 10;
        else if (c === maxVal) c += 10;
        else d += 10;
    }

    // Adjust rounding errors if sum > 100 after rounding
    // We need to loop because a single subtraction of 10 might not be enough if sum is 120 (e.g., 30+30+30+30)
    while (final_add > 100) {
        let for_min_a = (a === 0) ? 1000 : a;
        let for_min_b = (b === 0) ? 1000 : b;
        let for_min_c = (c === 0) ? 1000 : c;
        let for_min_d = (d === 0) ? 1000 : d;

        const minVal = Math.min(for_min_a, for_min_b, for_min_c, for_min_d);

        if (a === minVal && a > 0) a -= 10;
        else if (b === minVal && b > 0) b -= 10;
        else if (c === minVal && c > 0) c -= 10;
        else if (d > 0) d -= 10;

        // Recalculate sum
        final_add = a + b + c + d;
    }

    return { a, b, c, d };
};

exports.calculateReactionId = (a, b, c, d) => {
    let reaction_id = 0;
    if (a !== 0) reaction_id += 1;
    if (b !== 0) reaction_id += 10;
    if (c !== 0) reaction_id += 100;
    if (d !== 0) reaction_id += 1000;
    return reaction_id;
};
