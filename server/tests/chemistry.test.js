process.env.SUPABASE_URL = 'http://mock-url.com';
process.env.SUPABASE_KEY = 'mock-key';

let mockEqCalls = [];

jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => ({
            from: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: function(field, value) {
                        mockEqCalls.push([field, value]);
                        const chain = {
                            eq: function(f, v) {
                                mockEqCalls.push([f, v]);
                                return chain;
                            },
                            then: jest.fn((resolve) => resolve({ data: [{ mock: 'data' }], error: null }))
                        };
                        return chain;
                    }
                })
            })
        }))
    };
});

const resultController = require('../controllers/resultController');

describe('resultController.calculateResult', () => {
    let req;
    let res;

    beforeEach(() => {
        req = { params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockEqCalls = [];
    });

    it('should handle all-zero inputs (add === 0)', async () => {
        req.params = { chem_a: 0, chem_b: 0, chem_c: 0, chem_d: 0 };
        await resultController.calculateResult(req, res);

        expect(mockEqCalls[0]).toEqual(['conc_a', 0]);
        expect(mockEqCalls[1]).toEqual(['conc_b', 0]);
        expect(mockEqCalls[2]).toEqual(['conc_c', 0]);
        expect(mockEqCalls[3]).toEqual(['conc_d', 0]);
    });

    it('should iteratively round to exactly 100 (while loop rounding adjustments) - sum < 100 after rounding', async () => {
        req.params = { chem_a: 25, chem_b: 25, chem_c: 25, chem_d: 25 };
        await resultController.calculateResult(req, res);

        const sum = mockEqCalls[0][1] + mockEqCalls[1][1] + mockEqCalls[2][1] + mockEqCalls[3][1];
        expect(sum).toBe(100);
    });

    it('should iteratively round to exactly 100 - sum > 100 after rounding', async () => {
        req.params = { chem_a: 35, chem_b: 35, chem_c: 15, chem_d: 15 };
        await resultController.calculateResult(req, res);

        const sum = mockEqCalls[0][1] + mockEqCalls[1][1] + mockEqCalls[2][1] + mockEqCalls[3][1];
        expect(sum).toBe(100);
    });

    it('should normalize inputs if sum > 100 and sum !== 100 initially', async () => {
        req.params = { chem_a: 100, chem_b: 100, chem_c: 100, chem_d: 100 };
        await resultController.calculateResult(req, res);

        const sum = mockEqCalls[0][1] + mockEqCalls[1][1] + mockEqCalls[2][1] + mockEqCalls[3][1];
        expect(sum).toBe(100);
    });
});
