process.env.SUPABASE_URL = 'https://mock.supabase.co';
process.env.SUPABASE_KEY = 'mock-key';

// Mock Supabase to prevent connection errors during import
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn(),
    }))
}));

const { calculateConcentrations } = require('../controllers/resultController');

describe('calculateConcentrations Logic Verification', () => {

    test('Correctly calculates sum for simple inputs', () => {
        const result = calculateConcentrations(25, 25, 25, 25);
        const sum = result.a + result.b + result.c + result.d;
        expect(sum).toBe(100);
    });

    test('Correctly handles inputs that used to cause sum > 100 (Regression Test)', () => {
        const result = calculateConcentrations(25, 25, 25, 25);
        const sum = result.a + result.b + result.c + result.d;
        expect(sum).toBe(100);
    });

    test('Correctly handles normalization and rounding for equal small inputs', () => {
        // 4, 4, 4, 4 -> sum 16. Normalized -> 25, 25, 25, 25.
        // Same as above.
        const result = calculateConcentrations(4, 4, 4, 4);
        const sum = result.a + result.b + result.c + result.d;
        expect(sum).toBe(100);
    });

    test('Correctly handles inputs that round to > 100', () => {
        // 15, 15, 15, 55 -> sum 100.
        // 15->20, 15->20, 15->20, 55->60. Sum 120.
        // Adjustment: -10. Sum 110.
        const result = calculateConcentrations(15, 15, 15, 55);
        const sum = result.a + result.b + result.c + result.d;
        expect(sum).toBe(100);
    });

    test('Preserves small components when adjusting down (New Logic)', () => {
        // 85, 5, 5, 5 -> sum 100.
        // 85->90, 5->10, 5->10, 5->10. Sum 120.
        // Current Logic: Subtract from min (10) -> 90, 0, 10, 10. Sum 110.
        // One component lost.
        // New Logic should subtract from max (90) -> 80, 10, 10, 10. Sum 110.
        // Then iterate -> 70, 10, 10, 10. Sum 100.
        // So we expect no zeros.
        const result = calculateConcentrations(85, 5, 5, 5);
        const sum = result.a + result.b + result.c + result.d;
        expect(sum).toBe(100);
        expect(result.b).toBeGreaterThan(0);
        expect(result.c).toBeGreaterThan(0);
        expect(result.d).toBeGreaterThan(0);
    });

    test('Handles inputs that sum to < 100 after rounding', () => {
        // 14, 14, 14, 58 -> sum 100.
        // 10, 10, 10, 60 -> sum 90.
        // Adjust: Add to max (60) -> 70.
        // 10, 10, 10, 70 -> sum 100.
        const result = calculateConcentrations(14, 14, 14, 58);
        const sum = result.a + result.b + result.c + result.d;
        expect(sum).toBe(100);
    });
});
