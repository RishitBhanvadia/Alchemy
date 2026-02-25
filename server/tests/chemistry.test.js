const { calculateChemicals } = require('../utils/chemistry');

describe('calculateChemicals', () => {
    it('should correctly calculate normalized values and reaction_id for standard inputs', () => {
        // 50 + 50 + 0 + 0 = 100
        const result = calculateChemicals(50, 50, 0, 0);
        expect(result).toEqual({ a: 50, b: 50, c: 0, d: 0, reaction_id: 11 });
    });

    it('should normalize values when sum < 100', () => {
        // 10 + 10 + 0 + 0 = 20. Normalized: 50, 50, 0, 0
        const result = calculateChemicals(10, 10, 0, 0);
        expect(result).toEqual({ a: 50, b: 50, c: 0, d: 0, reaction_id: 11 });
    });

    it('should round values to nearest 10', () => {
        // 33 + 33 + 33 + 0 = 99. Normalized ~ 33.33...
        // Rounding: 30, 30, 30, 0 -> sum 90.
        // Adjusted: max(30, 30, 30) -> first one gets +10 -> 40, 30, 30, 0
        const result = calculateChemicals(33, 33, 33, 0);
        expect(result).toEqual({ a: 40, b: 30, c: 30, d: 0, reaction_id: 111 });
    });

    it('should handle rounding when sum > 100', () => {
        // 35, 35, 30, 0. Sum 100.
        // Rounding: 40, 40, 30, 0 -> sum 110.
        // Min val adjustment. Min(40, 40, 30, 0). But 0 is treated as 1000. So min is 30.
        // c -= 10 -> 20.
        // Result: 40, 40, 20, 0.
        const result = calculateChemicals(35, 35, 30, 0);
        expect(result).toEqual({ a: 40, b: 40, c: 20, d: 0, reaction_id: 111 });
    });

    it('should handle all zeros', () => {
        const result = calculateChemicals(0, 0, 0, 0);
        expect(result).toEqual({ a: 0, b: 0, c: 0, d: 0, reaction_id: 0 });
    });

    it('should generate correct reaction_id', () => {
        // a=10, b=0, c=0, d=0 -> id=1 (After normalization/rounding it might differ if logic is applied)
        // Wait, 10,0,0,0 -> sum 10 -> normalized to 100,0,0,0.
        expect(calculateChemicals(100, 0, 0, 0).reaction_id).toBe(1);

        // a=0, b=100, c=0, d=0 -> id=10
        expect(calculateChemicals(0, 100, 0, 0).reaction_id).toBe(10);
         // a=0, b=0, c=100, d=0 -> id=100
        expect(calculateChemicals(0, 0, 100, 0).reaction_id).toBe(100);
         // a=0, b=0, c=0, d=100 -> id=1000
        expect(calculateChemicals(0, 0, 0, 100).reaction_id).toBe(1000);
        // All present
        expect(calculateChemicals(25, 25, 25, 25).reaction_id).toBe(1111);
    });
});
