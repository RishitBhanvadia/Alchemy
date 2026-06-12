const { calculateResult } = require('../controllers/resultController');

// Mock request and response objects
const mockReq = (body) => ({ body });
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Mock supabase
jest.mock('../supabaseClient', () => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { outcome_label: 'Water' } }),
}));

describe('resultController', () => {
    it('should calculate result for valid chemicals', async () => {
        const req = mockReq({ chem_a: 50, chem_b: 50, chem_i: 0, chem_c: 0 });
        const res = mockRes();

        await calculateResult(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 for invalid chemicals (e.g. negative)', async () => {
        const req = mockReq({ chem_a: -10, chem_b: 50, chem_i: 0, chem_c: 0 });
        const res = mockRes();

        await calculateResult(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid concentration values. Each must be a number between 0 and 100.' });
    });

    it('should return 400 for invalid chemicals (e.g. >100)', async () => {
        const req = mockReq({ chem_a: 110, chem_b: 50, chem_i: 0, chem_c: 0 });
        const res = mockRes();

        await calculateResult(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid concentration values. Each must be a number between 0 and 100.' });
    });
});
