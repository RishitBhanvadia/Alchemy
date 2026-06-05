// Mock supabase BEFORE requiring controller
jest.mock('../supabaseClient', () => {
    return {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: { outcome_label: 'Mock' } }),
        single: jest.fn().mockResolvedValue({ data: { outcome_label: 'Water' } })
    };
});

const { calculateResult } = require('../controllers/resultController');
const logger = require('../utils/logger');

describe('Result Controller Logic', () => {
    it('should calculate correct reaction_id according to canonical weights', async () => {
        const req = {
            body: {
                chem_a: 0,
                chem_b: 0,
                chem_i: 100, // Indicator -> should be canonical weight 1000
                chem_c: 0  // Catalyst -> should be canonical weight 100
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const loggerSpy = jest.spyOn(logger, 'info').mockImplementation(() => {});

        await calculateResult(req, res);

        expect(loggerSpy).toHaveBeenCalledWith(
            expect.stringContaining('Reaction calculated'),
            expect.objectContaining({ reaction_id: 1000 })
        );

        loggerSpy.mockRestore();
    });
});
