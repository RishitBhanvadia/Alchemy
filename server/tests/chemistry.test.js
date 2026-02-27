const { validateInputs, calculateConcentrations, calculateReactionId } = require('../utils/chemistry');

describe('Chemistry Utils', () => {
    describe('validateInputs', () => {
        it('should validate correct inputs', () => {
            const params = { chem_a: 10, chem_b: 20, chem_c: 30, chem_d: 40 };
            const result = validateInputs(params);
            expect(result.isValid).toBe(true);
        });

        it('should fail if parameter is missing', () => {
            const params = { chem_a: 10, chem_b: 20, chem_c: 30 }; // missing d
            const result = validateInputs(params);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Missing parameter');
        });

        it('should fail if parameter is not a number', () => {
            const params = { chem_a: 10, chem_b: 'abc', chem_c: 30, chem_d: 40 };
            const result = validateInputs(params);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Invalid number');
        });

        it('should fail if parameter is out of range', () => {
            const params = { chem_a: 10, chem_b: 101, chem_c: 30, chem_d: 40 };
            const result = validateInputs(params);
            expect(result.isValid).toBe(false);
            expect(result.message).toBe('Value out of range (0-100)');
        });
    });

    describe('calculateConcentrations', () => {
        it('should normalize and round concentrations correctly', () => {
            // Sum = 100, no normalization needed, simple rounding
            const { a, b, c, d } = calculateConcentrations(25, 25, 25, 25);
            // 25 rounds to 30? No, round(2.5)*10 = 30.
            // Let's trace: 25/10 = 2.5 -> round(2.5) = 3 -> 30.
            // 30+30+30+30 = 120. > 100.
            // Adjustment: all are equal min (30). a reduced by 10 -> 20.
            // Result: 20, 30, 30, 30.
            // Wait, round(2.5) is 3 in JS Math.round? Yes.
            const sum = a + b + c + d;
            expect(sum).toBe(100);
        });

        it('should handle small numbers', () => {
            // 1, 1, 1, 1 -> sum 4.
            // Normalize: 1/4 = 0.25 -> 25.
            // 25, 25, 25, 25.
            // Same as above case.
            const { a, b, c, d } = calculateConcentrations(1, 1, 1, 1);
            expect(a + b + c + d).toBe(100);
        });

        it('should handle sum > 100 after rounding', () => {
            // 26, 26, 24, 24. Sum = 100.
            // 26 -> 30. 24 -> 20.
            // 30, 30, 20, 20. Sum = 100.
            const { a, b, c, d } = calculateConcentrations(26, 26, 24, 24);
            expect(a + b + c + d).toBe(100);
        });

         it('should handle sum < 100 after rounding', () => {
            // 24, 24, 24, 24. Sum 96 < 100.
            // Normalize: (24/96)*100 = 25.
            // 25 -> 30. Sum 120.
            // So normalize step might fix it.

            // Let's try inputs that round down.
            // 12, 12, 12, 12. Sum 48.
            // Normalize: (12/48)*100 = 25.
            // 25 -> 30. Sum 120.

            // Let's try explicit low sum input that doesn't trigger normalization (e.g. if we skipped it, but we don't).
            // Logic always normalizes if sum < 100.

            // What if inputs sum to 100, but round down?
            // 14, 14, 36, 36. Sum = 100.
            // 14 -> 10. 36 -> 40.
            // 10, 10, 40, 40. Sum = 100.

            // 4, 4, 4, 88. Sum 100.
            // 4->0, 88->90. Sum 90.
            // Adjustment: max is 90 (d). d+=10 -> 100.
            // Result 0, 0, 0, 100.
            const { a, b, c, d } = calculateConcentrations(4, 4, 4, 88);
            expect(a + b + c + d).toBe(100);
            expect(d).toBe(100);
        });

        it('should handle all zeros', () => {
             const { a, b, c, d } = calculateConcentrations(0, 0, 0, 0);
             expect(a).toBe(0);
             expect(b).toBe(0);
             expect(c).toBe(0);
             expect(d).toBe(0);
        });
    });

    describe('calculateReactionId', () => {
        it('should calculate correct ID for all chemicals present', () => {
            const id = calculateReactionId(10, 10, 10, 10);
            expect(id).toBe(1111);
        });

        it('should calculate correct ID for subset of chemicals', () => {
            const id = calculateReactionId(10, 0, 10, 0);
            expect(id).toBe(101); // 1 + 100
        });

        it('should return 0 for no chemicals', () => {
            const id = calculateReactionId(0, 0, 0, 0);
            expect(id).toBe(0);
        });
    });
});
