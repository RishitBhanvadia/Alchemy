const { calculateConcentrations } = require('../utils/concentrationLogic');

describe('Concentration Logic', () => {
    it('should calculate concentrations correctly for sum = 100', () => {
        const result = calculateConcentrations(50, 30, 20, 0);
        expect(result).toEqual({ a: 50, b: 30, c: 20, d: 0, reaction_id: 111 });
    });

    it('should normalize concentrations if sum < 100', () => {
        // 5 + 3 + 2 + 0 = 10. Normalization multiplies by 10.
        const result = calculateConcentrations(5, 3, 2, 0);
        expect(result).toEqual({ a: 50, b: 30, c: 20, d: 0, reaction_id: 111 });
    });

    it('should round concentrations to nearest 10', () => {
        // 54 -> 50, 46 -> 50. Sum 100.
        const result = calculateConcentrations(54, 46, 0, 0);
        expect(result).toEqual({ a: 50, b: 50, c: 0, d: 0, reaction_id: 11 });
    });

    it('should adjust rounding errors if sum < 100 after rounding', () => {
        // 33, 33, 34, 0. Rounds to 30, 30, 30, 0. Sum 90.
        // maxVal is 30. 'a' is matched first. a += 10 -> 40.
        const result = calculateConcentrations(33, 33, 34, 0);
        expect(result).toEqual({ a: 40, b: 30, c: 30, d: 0, reaction_id: 111 });
    });

    it('should adjust rounding errors if sum > 100 after rounding', () => {
        // 35, 35, 30, 0. Rounds to 40, 40, 30, 0. Sum 110.
        // minVal (excluding 0s) is 30 (c). c -= 10 -> 20.
        const result = calculateConcentrations(35, 35, 30, 0);
        expect(result).toEqual({ a: 40, b: 40, c: 20, d: 0, reaction_id: 111 });
    });

    it('should handle all zeros', () => {
        const result = calculateConcentrations(0, 0, 0, 0);
        expect(result).toEqual({ a: 0, b: 0, c: 0, d: 0, reaction_id: 0 });
    });

    it('should calculate correct reaction_id for all components', () => {
        // 25, 25, 25, 25. Rounds to 30, 30, 30, 30. Sum 120.
        // minVal is 30. 'a' is matched first. a -= 10 -> 20.
        // Result: 20, 30, 30, 30.
        // ID: 1 + 10 + 100 + 1000 = 1111.
        const result = calculateConcentrations(25, 25, 25, 25);
        expect(result).toEqual({ a: 20, b: 30, c: 30, d: 30, reaction_id: 1111 });
    });
});
