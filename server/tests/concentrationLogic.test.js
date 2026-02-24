const { calculateConcentrations } = require('../utils/concentrationLogic');

describe('calculateConcentrations', () => {

    test('should return input values if sum is 100', () => {
        const result = calculateConcentrations(50, 30, 20, 0);
        expect(result).toEqual({ a: 50, b: 30, c: 20, d: 0, reaction_id: 111 });
    });

    test('should normalize if sum is less than 100', () => {
        // sum = 50. Normalize: 25 -> 50, 15 -> 30, 10 -> 20.
        const result = calculateConcentrations(25, 15, 10, 0);
        expect(result).toEqual({ a: 50, b: 30, c: 20, d: 0, reaction_id: 111 });
    });

    test('should handle all zeros (bug fix)', () => {
        const result = calculateConcentrations(0, 0, 0, 0);
        expect(result).toEqual({ a: 0, b: 0, c: 0, d: 0, reaction_id: 0 });
    });

    test('should adjust rounding if sum < 100 after rounding', () => {
        const result = calculateConcentrations(33, 33, 33, 0);
        // 33+33+33=99. Normalized: ~33.33 each.
        // Rounded: 30, 30, 30. Sum 90.
        // Max is 30. a+=10 -> 40.
        expect(result).toEqual({ a: 40, b: 30, c: 30, d: 0, reaction_id: 111 });
    });

    test('should adjust rounding if sum > 100 after rounding', () => {
        // 55, 45, 0, 0 -> sum 100.
        // Rounded: 60, 50, 0, 0 -> sum 110.
        // minVal = 50 (b). b-=10 -> 40.
        // Result: 60, 40, 0, 0.
        const result = calculateConcentrations(55, 45, 0, 0);
        expect(result).toEqual({ a: 60, b: 40, c: 0, d: 0, reaction_id: 11 });
    });

    test('should calculate reaction_id correctly', () => {
        expect(calculateConcentrations(10, 0, 0, 0).reaction_id).toBe(1);
        expect(calculateConcentrations(0, 10, 0, 0).reaction_id).toBe(10);
        expect(calculateConcentrations(0, 0, 10, 0).reaction_id).toBe(100);
        expect(calculateConcentrations(0, 0, 0, 10).reaction_id).toBe(1000);
        expect(calculateConcentrations(10, 10, 10, 10).reaction_id).toBe(1111);
    });
});
