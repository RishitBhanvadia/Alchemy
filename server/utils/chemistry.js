
function calculateConcentrations(chem_a, chem_b, chem_c, chem_d) {
    let add = chem_a + chem_b + chem_c + chem_d;

    if (add === 0) {
        return { a: 0, b: 0, c: 0, d: 0, sum: 0 };
    }

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

    let final_add = a + b + c + d;

    while (final_add < 100) {
        const maxVal = Math.max(a, b, c, d);
        if (a === maxVal) a += 10;
        else if (b === maxVal) b += 10;
        else if (c === maxVal) c += 10;
        else d += 10;
        final_add += 10;
    }

    while (final_add > 100) {
        let for_min_a = (a === 0) ? 1000 : a;
        let for_min_b = (b === 0) ? 1000 : b;
        let for_min_c = (c === 0) ? 1000 : c;
        let for_min_d = (d === 0) ? 1000 : d;

        const minVal = Math.min(for_min_a, for_min_b, for_min_c, for_min_d);

        if (a === minVal) a -= 10;
        else if (b === minVal) b -= 10;
        else if (c === minVal) c -= 10;
        else d -= 10;
        final_add -= 10;
    }

    return { a, b, c, d, sum: final_add };
}

module.exports = { calculateConcentrations };
