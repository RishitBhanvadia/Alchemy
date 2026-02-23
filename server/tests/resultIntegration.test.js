const mockSelectBuilder = {
    eq: jest.fn().mockReturnThis(),
    then: jest.fn((resolve) => resolve({ data: ['mockData'], error: null }))
};

// Define mocks at top level so they apply to all requires
jest.mock('../utils/calculationLogic');
jest.mock('@supabase/supabase-js', () => ({
    createClient: () => ({
        from: jest.fn(() => ({
            select: jest.fn(() => mockSelectBuilder)
        }))
    })
}));

describe('resultController Integration', () => {
    let req, res, resultController, calculateConcentrations;

    beforeEach(() => {
        jest.resetModules();

        // Re-require modules to ensure clean state and fresh mocks
        const logicModule = require('../utils/calculationLogic');
        calculateConcentrations = logicModule.calculateConcentrations;

        resultController = require('../controllers/resultController');

        req = {
            params: { chem_a: '50', chem_b: '30', chem_c: '20', chem_d: '0' }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        // Setup mock return value on the fresh mock instance
        calculateConcentrations.mockReturnValue({
             a: 50, b: 30, c: 20, d: 0, reaction_id: 111
        });

        mockSelectBuilder.eq.mockClear();
    });

    it('should call calculateConcentrations and return data', async () => {
        await resultController.calculateResult(req, res);

        expect(calculateConcentrations).toHaveBeenCalledWith(50, 30, 20, 0);
        expect(res.json).toHaveBeenCalledWith(['mockData']);
    });

    it('should handle invalid parameters', async () => {
        req.params.chem_a = 'invalid';
        await resultController.calculateResult(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Invalid number') }));
    });
});
