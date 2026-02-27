
const { calculateConcentrations } = require('../utils/chemistry');

describe('calculateConcentrations', () => {
    test('should handle normal inputs correctly (50, 30, 20, 0)', () => {
        const result = calculateConcentrations(50, 30, 20, 0);
        expect(result).toEqual({ a: 50, b: 30, c: 20, d: 0, sum: 100 });
    });

    test('should handle zero inputs correctly (0, 0, 0, 0)', () => {
        const result = calculateConcentrations(0, 0, 0, 0);
        expect(result).toEqual({ a: 0, b: 0, c: 0, d: 0, sum: 0 });
    });

    test('should handle sum less than 100 with normalization (25, 25, 25, 25 -> 100)', () => {
        // Input sum is 100, but logic normalizes if sum < 100.
        // If input is exactly 100, it shouldn't normalize, just round.
        const result = calculateConcentrations(25, 25, 25, 25);
        // 25 -> 30, 25 -> 30, 25 -> 30, 25 -> 30. Sum = 120. Needs adjustment.
        expect(result.sum).toBe(100);
        // Expect adjustments to lower values.
        expect(result.a + result.b + result.c + result.d).toBe(100);
    });

    test('should handle inputs needing rounding adjustment (12.5, 12.5, 12.5, 62.5)', () => {
        const result = calculateConcentrations(12.5, 12.5, 12.5, 62.5);
        // 12.5 -> 10, 12.5 -> 10, 12.5 -> 10, 62.5 -> 60. Sum = 90. Needs adjustment +10.
        expect(result.sum).toBe(100);
        expect(result.a + result.b + result.c + result.d).toBe(100);
    });

    test('should handle very small inputs (normalization)', () => {
        const result = calculateConcentrations(1, 1, 1, 1);
        // Sum = 4. Normalize: each becomes 25.
        // 25 -> 30. Sum 120. Adjust down 20.
        expect(result.sum).toBe(100);
        expect(result.a + result.b + result.c + result.d).toBe(100);
    });
});
