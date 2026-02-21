
const resultController = require('../controllers/resultController');

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
    return {
        createClient: jest.fn(() => ({
            from: jest.fn(() => ({
                select: jest.fn(() => ({
                    eq: jest.fn().mockReturnThis()
                }))
            }))
        }))
    };
});

describe('resultController Logic', () => {
    let req, res;
    let consoleSpy;

    beforeEach(() => {
        req = {
            params: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 for all zeros (Fix Logic Error 1)', async () => {
        req.params = { chem_a: '0', chem_b: '0', chem_c: '0', chem_d: '0' };

        await resultController.calculateResult(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringMatching(/Total concentration cannot be zero|Invalid sum/i)
        }));
    });

    test('should normalize 25, 25, 25, 25 to sum 100 (Fix Logic Error 2)', async () => {
        req.params = { chem_a: '25', chem_b: '25', chem_c: '25', chem_d: '25' };

        await resultController.calculateResult(req, res);

        // Capture the log message "Querying Supabase: A:..., B:..., C:..., D:..., ID:..."
        const calls = consoleSpy.mock.calls;
        const queryLog = calls.find(call => call[0].startsWith('Querying Supabase:'));

        expect(queryLog).toBeDefined();
        const logMsg = queryLog[0];

        // Extract values
        const matches = logMsg.match(/A:(\d+), B:(\d+), C:(\d+), D:(\d+)/);
        expect(matches).not.toBeNull();

        const a = parseInt(matches[1]);
        const b = parseInt(matches[2]);
        const c = parseInt(matches[3]);
        const d = parseInt(matches[4]);

        const sum = a + b + c + d;
        expect(sum).toBe(100);

        // Also ensure no chemical was zeroed out (since inputs were equal)
        expect(a).toBeGreaterThan(0);
        expect(b).toBeGreaterThan(0);
        expect(c).toBeGreaterThan(0);
        expect(d).toBeGreaterThan(0);
    });
});
