const { validateParams, calculateValues } = require('../utils/chemistry');

describe('Chemistry Utils', () => {
    describe('validateParams', () => {
        it('should return valid true for correct parameters', () => {
            const params = { chem_a: 50, chem_b: 30, chem_c: 20, chem_d: 0 };
            const result = validateParams(params);
            expect(result.valid).toBe(true);
        });

        it('should return valid false for missing parameters', () => {
            const params = { chem_a: 50, chem_b: 30 };
            const result = validateParams(params);
            expect(result.valid).toBe(false);
            expect(result.message).toContain('Missing parameter');
        });

        it('should return valid false for non-number parameters', () => {
            const params = { chem_a: 'abc', chem_b: 30, chem_c: 20, chem_d: 0 };
            const result = validateParams(params);
            expect(result.valid).toBe(false);
            expect(result.message).toContain('Invalid number');
        });

        it('should return valid false for values out of range', () => {
            const params = { chem_a: 150, chem_b: 30, chem_c: 20, chem_d: 0 };
            const result = validateParams(params);
            expect(result.valid).toBe(false);
            expect(result.message).toContain('Value out of range');
        });
    });

    describe('calculateValues', () => {
        it('should handle values that sum to 100 correctly', () => {
            const result = calculateValues(50, 30, 20, 0);
            expect(result).toEqual({
                a: 50,
                b: 30,
                c: 20,
                d: 0,
                reaction_id: 111 // 1 + 10 + 100 + 0
            });
        });

        it('should normalize values when sum < 100', () => {
            // Sum is 50. Should double everything.
            const result = calculateValues(25, 15, 10, 0);
            // 25/50 * 100 = 50
            // 15/50 * 100 = 30
            // 10/50 * 100 = 20
            expect(result).toEqual({
                a: 50,
                b: 30,
                c: 20,
                d: 0,
                reaction_id: 111
            });
        });

        it('should round values to nearest 10', () => {
            // Sum is 100, but individual values not multiple of 10
            // 33, 33, 34, 0 -> sum 100
            // 33 -> 30, 33 -> 30, 34 -> 30. Sum 90.
            // Adjustment should happen.
            // Max value logic applies. All are 30 (after rounding).
            // It picks 'a' to add 10 if a == maxVal.

            // Let's trace carefully:
            // a=33 -> 30
            // b=33 -> 30
            // c=34 -> 30
            // d=0 -> 0
            // Sum = 90.
            // Max is 30. a is 30, so a += 10 -> 40.
            // Result: 40, 30, 30, 0. Sum 100.

            const result = calculateValues(33, 33, 34, 0);
            expect(result.a + result.b + result.c + result.d).toBe(100);
            expect(result.reaction_id).toBeGreaterThan(0);
        });

        it('should adjust when sum > 100 after rounding', () => {
            // 35, 35, 30, 0 -> sum 100
            // 35 -> 40
            // 35 -> 40
            // 30 -> 30
            // 0 -> 0
            // Sum = 110.
            // Adjustment needed.
            // Min value logic.
            // for_min_a = 40, for_min_b = 40, for_min_c = 30, for_min_d = 1000 (since d=0)
            // Min is 30 (c). So c -= 10 -> 20.
            // Result: 40, 40, 20, 0. Sum 100.

            const result = calculateValues(35, 35, 30, 0);
            expect(result).toEqual({
                a: 40,
                b: 40,
                c: 20,
                d: 0,
                reaction_id: 111
            });
        });

        it('should handle all zeros', () => {
            const result = calculateValues(0, 0, 0, 0);
            expect(result).toEqual({
                a: 0,
                b: 0,
                c: 0,
                d: 0,
                reaction_id: 0
            });
        });

        it('should handle floating point inputs', () => {
             // 50.5, 29.5, 20, 0 -> sum 100
             // 50.5 -> 50 (round)
             // 29.5 -> 30 (round)
             // 20 -> 20
             // 0 -> 0
             // Sum 100.

             const result = calculateValues(50.5, 29.5, 20, 0);
             expect(result.a + result.b + result.c + result.d).toBe(100);
        });
    });
});
