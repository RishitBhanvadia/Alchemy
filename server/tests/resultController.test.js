process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_KEY = 'test_key';
const { calculateResult } = require('../controllers/resultController');

describe('calculateResult math check logic', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.spyOn(console, 'log').mockImplementation((msg) => {
            if (msg.startsWith('Querying Supabase:')) {
                res.queryResult = msg;
            }
        });
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const cases = [
        {a: 55, b: 45, c: 0, d: 0},
        {a: 33, b: 33, c: 34, d: 0},
        {a: 25, b: 25, c: 25, d: 25},
        {a: 10, b: 20, c: 0, d: 0},
        {a: 0, b: 0, c: 0, d: 0},
        {a: 1, b: 99, c: 0, d: 0},
        {a: 99, b: 1, c: 0, d: 0},
    ];

    cases.forEach(c => {
        it(`should calculate correctly for ${c.a}, ${c.b}, ${c.c}, ${c.d}`, async () => {
            req.params = { chem_a: c.a, chem_b: c.b, chem_c: c.c, chem_d: c.d };
            await calculateResult(req, res);

            // Extract a, b, c, d from queryResult
            const match = res.queryResult.match(/A:(\d+), B:(\d+), C:(\d+), D:(\d+)/);
            if (match) {
                const finalA = parseInt(match[1]);
                const finalB = parseInt(match[2]);
                const finalC = parseInt(match[3]);
                const finalD = parseInt(match[4]);
                const sum = finalA + finalB + finalC + finalD;

                const initialSum = c.a + c.b + c.c + c.d;
                if (initialSum === 0) {
                    expect(sum).toBe(0);
                } else {
                    expect(sum).toBe(100);
                }
            } else {
                if (c.a + c.b + c.c + c.d === 0) {
                    // NaN cases for initial 0s or empty handled correctly
                    // Though actually 0 sum correctly outputs a,b,c,d=0
                    expect(res.queryResult).toContain('A:0');
                }
            }
        });
    });
});
