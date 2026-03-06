process.env.SUPABASE_URL = 'http://dummy.supabase.co';
process.env.SUPABASE_KEY = 'dummy_key';

const mockEq = jest.fn();
// We need eq to return an object that also has eq, but mockResolvedValueOnce must work on the final eq call
const eqChain = { eq: mockEq };
mockEq.mockReturnValue(eqChain);

const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn(() => ({
            select: mockSelect
        }))
    }))
}));

const { calculateResult } = require('../controllers/resultController');

describe('resultController logic', () => {
    let req;
    let res;

    beforeEach(() => {
        mockEq.mockClear();
        mockEq.mockReturnValue(eqChain); // Reset the return value to the chain by default
        mockSelect.mockClear();
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    it('should handle all zeroes without NaN', async () => {
        req = { params: { chem_a: '0', chem_b: '0', chem_c: '0', chem_d: '0' } };

        await calculateResult(req, res);

        expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should loop to fix cumulative rounding errors', async () => {
        req = { params: { chem_a: '25', chem_b: '25', chem_c: '25', chem_d: '25' } };

        // mockResolvedValueOnce on the mockEq will return the promise on the first call it handles
        // Wait, eq is called 5 times. We only want the last one to resolve with the data.
        // If we mockReturnValue it returns the chain object, but we need the promise on the 5th call.

        mockEq.mockImplementation(() => {
            if (mockEq.mock.calls.length === 5) {
                return Promise.resolve({ data: [{ id: 1 }], error: null });
            }
            return eqChain;
        });

        await calculateResult(req, res);

        expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);

        // Verify the database was queried because it reached the end properly
        expect(mockEq).toHaveBeenCalled();
    });
});
