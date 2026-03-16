const { calculateResult } = require('../controllers/resultController');

// Define mocks inside jest.mock
jest.mock('@supabase/supabase-js', () => {
    const mockEq = jest.fn().mockReturnThis();
    const mockGte = jest.fn().mockReturnThis();
    const mockLte = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockSingle = jest.fn().mockResolvedValue({ data: { product_name: 'Test' }, error: null });
    const mockInsert = jest.fn().mockResolvedValue({ data: {}, error: null });

    return {
        createClient: jest.fn(() => ({
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: mockEq,
            gte: mockGte,
            lte: mockLte,
            limit: mockLimit,
            single: mockSingle,
            insert: mockInsert,
            // Expose them so tests can access via creating client
            _getMocks: () => ({ mockEq, mockGte, mockLte, mockLimit, mockSingle, mockInsert })
        }))
    };
});

describe('calculateResult logic tests', () => {
    let mockRes;
    let mocks;

    beforeEach(() => {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient();
        mocks = supabase._getMocks();

        mocks.mockEq.mockClear();
        mocks.mockSingle.mockClear();

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should iteratively adjust rounding errors so sum is exactly 100', async () => {
        let req = { body: { chem_a: 4, chem_b: 4, chem_c: 4, chem_d: 4 } };
        await calculateResult(req, mockRes);

        expect(mocks.mockEq).toHaveBeenCalledWith('conc_a', 10);
        expect(mocks.mockEq).toHaveBeenCalledWith('conc_b', 30);
        expect(mocks.mockEq).toHaveBeenCalledWith('conc_c', 30);
        expect(mocks.mockEq).toHaveBeenCalledWith('conc_d', 30);
    });

    it('should iteratively adjust upward so sum is exactly 100', async () => {
        let req = { body: { chem_a: 33, chem_b: 33, chem_c: 34, chem_d: 0 } };
        await calculateResult(req, mockRes);

        expect(mocks.mockEq).toHaveBeenCalledWith('conc_a', 40);
        expect(mocks.mockEq).toHaveBeenCalledWith('conc_b', 30);
        expect(mocks.mockEq).toHaveBeenCalledWith('conc_c', 30);
        expect(mocks.mockEq).toHaveBeenCalledWith('conc_d', 0);
    });

    it('should not adjust if sum is 0', async () => {
        let req = { body: { chem_a: 0, chem_b: 0, chem_c: 0, chem_d: 0 } };
        await calculateResult(req, mockRes);

        expect(mocks.mockEq).toHaveBeenCalledWith('conc_a', 0);
        expect(mocks.mockEq).toHaveBeenCalledWith('conc_b', 0);
        expect(mocks.mockEq).toHaveBeenCalledWith('conc_c', 0);
        expect(mocks.mockEq).toHaveBeenCalledWith('conc_d', 0);
    });
});
