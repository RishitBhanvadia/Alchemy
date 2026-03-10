const { calculateResult } = require('../controllers/resultController');

jest.mock('@supabase/supabase-js', () => {
    const chain = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: jest.fn((resolve) => resolve({ data: [], error: null }))
    };
    return {
        createClient: jest.fn(() => chain)
    };
});

describe('calculateResult logic', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle zero concentrations without NaN', async () => {
        const req = {
            params: { chem_a: '0', chem_b: '0', chem_c: '0', chem_d: '0' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        await calculateResult(req, res);

        // Assert it logged the expected query without NaN
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('A:0, B:0, C:0, D:0, ID:0'));
        expect(res.json).toHaveBeenCalled();
        consoleSpy.mockRestore();
    });

    it('should iteratively adjust sum < 100', async () => {
        const req = {
            params: { chem_a: '1', chem_b: '1', chem_c: '1', chem_d: '1' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        await calculateResult(req, res);

        // Assert it logs exact normalized rounding to hit exactly 100
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ID:1111'));
        consoleSpy.mockRestore();
    });
});
