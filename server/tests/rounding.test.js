// Ensure we mock the module before requiring the controller
const mockSingle = jest.fn();
const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
const mockFrom = jest.fn().mockReturnValue({ select: mockSelect });

const mockSupabase = {
    from: mockFrom
};

jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => mockSupabase)
    };
});

const { calculateResult } = require('../controllers/resultController');

describe('Result Controller Logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Return some dummy data so it doesn't fail
        mockSingle.mockResolvedValue({ data: { outcome: 'Success' }, error: null });
        mockEq.mockReturnValue({ eq: mockEq, single: mockSingle });
    });

    it('should correctly normalize and round chemical concentrations exactly to 100 for 25, 25, 25, 25', async () => {
        const req = {
            body: {
                chem_a: 25,
                chem_b: 25,
                chem_c: 25,
                chem_d: 25
            }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await calculateResult(req, res);

        // The exact match query uses the a, b, c, d values.
        // If they sum to 120, and only one is subtracted, they will sum to 110.
        // We want to assert they sum to exactly 100 in the query.

        // Find the calls to .eq()
        // The controller does:
        // .eq('conc_a', a)
        // .eq('conc_b', b)
        // .eq('conc_c', c)
        // .eq('conc_d', d)

        let conc_a = 0, conc_b = 0, conc_c = 0, conc_d = 0;

        mockEq.mock.calls.forEach(call => {
            if (call[0] === 'conc_a') conc_a = call[1];
            if (call[0] === 'conc_b') conc_b = call[1];
            if (call[0] === 'conc_c') conc_c = call[1];
            if (call[0] === 'conc_d') conc_d = call[1];
        });

        const sum = conc_a + conc_b + conc_c + conc_d;
        expect(sum).toBe(100);
    });
});
