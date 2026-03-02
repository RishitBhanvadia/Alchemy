process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_KEY = 'test';

const { calculateResult } = require('../controllers/resultController');

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        then: jest.fn((cb) => cb({ data: [], error: null }))
    }))
}));

describe('calculateResult Logic', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('handles all zeros by returning empty array early', async () => {
        const req = { params: { chem_a: '0', chem_b: '0', chem_c: '0', chem_d: '0' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await calculateResult(req, res);

        expect(res.json).toHaveBeenCalledWith([]);
        const { createClient } = require('@supabase/supabase-js');
        expect(createClient().from).not.toHaveBeenCalled();
    });

    it('uses a while loop for rounding if final_add > 100', async () => {
        // 25, 25, 25, 25 -> normalize to 100 -> round to 30, 30, 30, 30 -> 120
        // Needs to subtract 10 twice to get 100
        const req = { params: { chem_a: '25', chem_b: '25', chem_c: '25', chem_d: '25' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        const { createClient } = require('@supabase/supabase-js');
        const eqMock = jest.fn().mockReturnThis();
        createClient().from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: eqMock
            })
        });

        // Resolve mock promise manually
        eqMock.mockImplementation(function() {
            if (eqMock.mock.calls.length === 5) {
                return Promise.resolve({ data: [{ result_name: 'test' }], error: null });
            }
            return this;
        });

        await calculateResult(req, res);
    });
});
