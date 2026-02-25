
const resultController = require('../controllers/resultController');

// Simple mock for Supabase to prevent crash
jest.mock('@supabase/supabase-js', () => ({
    createClient: () => ({
        from: () => ({
            select: () => ({
                eq: () => ({
                    eq: () => ({
                        eq: () => ({
                            eq: () => ({
                                eq: () => ({
                                    then: (cb) => cb({ data: [], error: null })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}));

describe('resultController Logic Verification', () => {
    let req, res;
    let consoleLogSpy;

    beforeEach(() => {
        req = {
            params: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should handle all zeros inputs gracefully (no NaN)', async () => {
        req.params = { chem_a: '0', chem_b: '0', chem_c: '0', chem_d: '0' };

        await resultController.calculateResult(req, res);

        const logs = consoleLogSpy.mock.calls.map(args => args[0]);
        const queryLog = logs.find(l => typeof l === 'string' && l.includes('Querying Supabase:'));

        expect(queryLog).not.toMatch(/NaN/);
        expect(queryLog).toContain('A:0');
        expect(queryLog).toContain('ID:0');
    });

    test('should normalize small inputs correctly', async () => {
        req.params = { chem_a: '10', chem_b: '0', chem_c: '0', chem_d: '0' };
        await resultController.calculateResult(req, res);
        const logs = consoleLogSpy.mock.calls.map(args => args[0]);
        // Since calls accumulate, we need to filter or find the relevant one.
        // But logic runs sequentially.
        const queryLog = logs.slice().reverse().find(l => typeof l === 'string' && l.includes('Querying Supabase:'));

        expect(queryLog).toContain('A:100');
        expect(queryLog).toContain('ID:1');
    });

    test('should adjust rounding errors correctly', async () => {
        // 33, 33, 34, 0 -> Sum 100
        // Rounding: 30, 30, 30, 0 -> Sum 90
        // Adjustment: a becomes 40 (since a=30 is maxVal)
        req.params = { chem_a: '33', chem_b: '33', chem_c: '34', chem_d: '0' };

        await resultController.calculateResult(req, res);

        const logs = consoleLogSpy.mock.calls.map(args => args[0]);
        const queryLog = logs.slice().reverse().find(l => typeof l === 'string' && l.includes('Querying Supabase:'));

        // Either A, B, or C is adjusted. Since logic checks A first:
        // if (a === maxVal) a += 10;
        // All are 30. So A matches first.
        expect(queryLog).toContain('A:40');
        expect(queryLog).toContain('B:30');
        expect(queryLog).toContain('C:30');
        expect(queryLog).toContain('D:0');
    });
});
