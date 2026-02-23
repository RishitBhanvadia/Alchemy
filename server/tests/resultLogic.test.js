const { calculateConcentrations } = require('../utils/calculationLogic');

describe('calculateConcentrations', () => {
    it('should handle exact sum of 100 with multiples of 10', () => {
        const result = calculateConcentrations(50, 30, 20, 0);
        expect(result).toEqual({
            a: 50, b: 30, c: 20, d: 0,
            reaction_id: 111 // 1 + 10 + 100
        });
    });

    it('should normalize and round when sum < 100', () => {
        // 10, 10, 10, 10 -> Sum 40.
        // Normalize: 25, 25, 25, 25.
        // Round: 30, 30, 30, 30. Sum 120.
        // Correction (>100): Subtract 10 from min (30).
        // Result: 20, 30, 30, 30.

        const result = calculateConcentrations(10, 10, 10, 10);
        expect(result).toEqual({
            a: 20, b: 30, c: 30, d: 30,
            reaction_id: 1111 // 1+10+100+1000
        });
    });

    it('should handle rounding errors where sum < 100', () => {
        // 33, 33, 34, 0 -> Sum 100. No normalize.
        // Round: 30, 30, 30, 0. Sum 90.
        // Correction (<100): Add 10 to max (30).
        // a is max. a += 10 -> 40.
        // Result: 40, 30, 30, 0.

        const result = calculateConcentrations(33, 33, 34, 0);
        expect(result).toEqual({
            a: 40, b: 30, c: 30, d: 0,
            reaction_id: 111
        });
    });

    it('should handle sum > 100 without normalization', () => {
        // 30, 30, 30, 20 -> Sum 110.
        // Round: 30, 30, 30, 20. Sum 110.
        // Correction (>100): Subtract 10 from min (20).
        // d is min. d -= 10 -> 10.
        // Result: 30, 30, 30, 10. Sum 100.

        const result = calculateConcentrations(30, 30, 30, 20);
        expect(result).toEqual({
            a: 30, b: 30, c: 30, d: 10,
            reaction_id: 1111
        });
    });

     it('should handle all zeros', () => {
        const result = calculateConcentrations(0, 0, 0, 0);
        expect(result).toEqual({
            a: 0, b: 0, c: 0, d: 0,
            reaction_id: 0
        });
    });
});
