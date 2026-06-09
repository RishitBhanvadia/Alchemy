jest.mock('../supabaseClient', () => {
    const mockEq = jest.fn().mockReturnThis();
    return {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: mockEq,
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null }),
        single: jest.fn().mockResolvedValue({ data: { outcome_label: 'Water' } }),
        mockEq
    };
});

const { calculateResult } = require('../controllers/resultController');
const supabase = require('../supabaseClient');

describe('Result Controller Logic', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('should calculate correct reaction_id with correct positional weights', async () => {
        req.body = { chem_a: 0, chem_b: 0, chem_i: 100, chem_c: 0 }; // Only indicator

        await calculateResult(req, res);

        // The first call to .eq should be for reaction_id
        // Indicator should be 1000, not 100
        expect(supabase.mockEq).toHaveBeenCalledWith('reaction_id', 1000);
    });
});
