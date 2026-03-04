process.env.SUPABASE_URL = 'http://test.com';
process.env.SUPABASE_KEY = 'test_key';

let mockData = [];
let mockError = null;

const mockBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis()
};

jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => ({
            from: jest.fn().mockReturnValue(mockBuilder)
        }))
    };
});

mockBuilder.eq.mockImplementation(function() {
    const promise = Promise.resolve({ data: mockData, error: mockError });
    promise.eq = mockBuilder.eq;
    promise.select = mockBuilder.select;
    return promise;
});

const { calculateResult } = require('../controllers/resultController');

const res = {
    json: jest.fn(),
    status: jest.fn().mockReturnThis(),
};

describe('calculateResult logic', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockBuilder.eq.mockClear();
        res.json.mockClear();
        res.status.mockClear();
    });

    it('should adjust rounding errors iteratively if sum > 100', async () => {
        const req = {
            params: {
                chem_a: '35',
                chem_b: '35',
                chem_c: '35',
                chem_d: '35'
            }
        };

        await calculateResult(req, res);

        // 35 * 4 = 140
        // 35/140 * 100 = 25
        // Round to nearest 10: 30, 30, 30, 30
        // Sum = 120. Needs to drop by 20.
        // Should iteratively reduce until sum is 100.
        // 20, 20, 30, 30 -> 100, or something similar
        const calls = mockBuilder.eq.mock.calls;
        let sum = 0;
        let a, b, c, d;
        for (const call of calls) {
            if (call[0] === 'conc_a') a = call[1];
            if (call[0] === 'conc_b') b = call[1];
            if (call[0] === 'conc_c') c = call[1];
            if (call[0] === 'conc_d') d = call[1];
        }
        sum = a + b + c + d;
        expect(sum).toBe(100);
    });

    it('should calculate all 0 correctly (add === 0)', async () => {
        const req = {
            params: {
                chem_a: '0',
                chem_b: '0',
                chem_c: '0',
                chem_d: '0'
            }
        };

        await calculateResult(req, res);

        const calls = mockBuilder.eq.mock.calls;
        let sum = 0;
        let a, b, c, d;
        for (const call of calls) {
            if (call[0] === 'conc_a') a = call[1];
            if (call[0] === 'conc_b') b = call[1];
            if (call[0] === 'conc_c') c = call[1];
            if (call[0] === 'conc_d') d = call[1];
        }
        sum = a + b + c + d;
        expect(sum).toBe(0);
        expect(a).toBe(0);
        expect(b).toBe(0);
        expect(c).toBe(0);
        expect(d).toBe(0);
    });
});
