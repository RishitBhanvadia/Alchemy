const { calculateResult } = require('../controllers/resultController');

jest.mock('../supabaseClient', () => {
    return {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { result: 'test' }, error: null }),
        insert: jest.fn().mockResolvedValue({ error: null })
    };
});

describe('resultController logic errors', () => {
    let mockRes;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should calculate valid result', async () => {
        const req = {
            body: {
                chem_a: 50,
                chem_b: 50,
                chem_c: 0,
                chem_i: 0
            }
        };

        await calculateResult(req, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should reject invalid chem_i', async () => {
        const req = {
            body: {
                chem_a: 50,
                chem_b: 50,
                chem_c: 0,
                chem_i: "invalid_string"
            }
        };

        await calculateResult(req, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
    });
});
