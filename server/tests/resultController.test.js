const { calculateResult } = require('../controllers/resultController');

// Mock response object
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockCapturedQuery = {};

// We need to properly mock the Supabase client created at module scope
jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => ({
            from: jest.fn(() => {
                const chain = {
                    select: jest.fn(() => chain),
                    eq: jest.fn((key, val) => {
                        mockCapturedQuery[key] = val;
                        return chain;
                    }),
                };
                // Make the chain thenable so await resolves
                chain.then = (resolve) => resolve({ data: [{ result: 'success' }], error: null });
                return chain;
            })
        }))
    };
});

describe('Result Controller Normalization', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Object.keys(mockCapturedQuery).forEach(key => delete mockCapturedQuery[key]);
    });

    it('should not propagate NaN when sum is zero', async () => {
        const req = {
            params: { chem_a: '0', chem_b: '0', chem_c: '0', chem_d: '0' }
        };
        const res = mockRes();

        await calculateResult(req, res);

        // When sum is 0, add is 0. Since add < 100, it attempts to divide by add (0),
        // resulting in NaN, which propagates through Math.round, becoming NaN.
        expect(mockCapturedQuery.conc_a).not.toBeNaN();
        expect(mockCapturedQuery.conc_a).toBe(0);
    });

    it('should handle rounding adjustments correctly to sum to exactly 100', async () => {
        const req = {
            params: { chem_a: '25', chem_b: '25', chem_c: '25', chem_d: '25' }
        };
        const res = mockRes();

        await calculateResult(req, res);

        const a = mockCapturedQuery.conc_a;
        const b = mockCapturedQuery.conc_b;
        const c = mockCapturedQuery.conc_c;
        const d = mockCapturedQuery.conc_d;

        expect(a + b + c + d).toBe(100);
    });
});
