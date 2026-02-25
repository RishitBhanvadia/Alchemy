
const mockBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
};
// Add Promise interface
mockBuilder.then = jest.fn((resolve, reject) => {
    resolve({ data: [{ id: 1, test: 'data' }], error: null });
});

const mockSupabase = {
    from: jest.fn(() => mockBuilder)
};

jest.mock('@supabase/supabase-js', () => ({
    createClient: () => mockSupabase
}));

const resultController = require('../controllers/resultController');

describe('resultController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                chem_a: '50',
                chem_b: '50',
                chem_c: '0',
                chem_d: '0'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    it('should calculate result and query supabase', async () => {
        await resultController.calculateResult(req, res);

        expect(mockSupabase.from).toHaveBeenCalledWith('results');
        expect(mockBuilder.select).toHaveBeenCalledWith('*');
        // calculateChemicals(50, 50, 0, 0) -> a:50, b:50, c:0, d:0, reaction_id: 11
        expect(mockBuilder.eq).toHaveBeenCalledWith('conc_a', 50);
        expect(mockBuilder.eq).toHaveBeenCalledWith('conc_b', 50);
        expect(mockBuilder.eq).toHaveBeenCalledWith('reaction_id', 11);

        expect(res.json).toHaveBeenCalledWith([{ id: 1, test: 'data' }]);
    });

    it('should return 400 for invalid inputs', async () => {
        req.params.chem_a = 'invalid';
        await resultController.calculateResult(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockSupabase.from).not.toHaveBeenCalled();
    });

    it('should return 400 for out of range inputs', async () => {
        req.params.chem_a = '150';
        await resultController.calculateResult(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(mockSupabase.from).not.toHaveBeenCalled();
    });
});
