
describe('Result Logic - Normalization Bug', () => {
    let resultController;
    let mockEq;
    let mockBuilder;

    beforeEach(() => {
        jest.resetModules(); // Clears require cache to allow re-mocking
        process.env.SUPABASE_URL = 'http://mock.supabase.co';
        process.env.SUPABASE_KEY = 'mock-key';

        mockEq = jest.fn().mockReturnThis();
        mockBuilder = {
             select: jest.fn().mockReturnThis(),
             eq: mockEq,
             then: (resolve) => resolve({ data: [], error: null })
        };

        jest.doMock('@supabase/supabase-js', () => ({
            createClient: () => ({
                from: jest.fn(() => mockBuilder)
            })
        }));

        resultController = require('../controllers/resultController');
    });

    it('should normalize concentrations when sum > 100', async () => {
        const req = {
            params: {
                chem_a: '50',
                chem_b: '50',
                chem_c: '50',
                chem_d: '50'
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await resultController.calculateResult(req, res);

        // Verify that Supabase was called
        expect(mockEq).toHaveBeenCalled();

        // Check the arguments passed to .eq() for concentrations
        const calls = mockEq.mock.calls;
        const argMap = {};
        calls.forEach(call => {
            // call is [key, value]
            if (call[0].startsWith('conc_')) {
                argMap[call[0]] = call[1];
            }
        });

        console.log('Normalized concentrations sent to DB:', argMap);

        const sum = (argMap['conc_a'] || 0) +
                    (argMap['conc_b'] || 0) +
                    (argMap['conc_c'] || 0) +
                    (argMap['conc_d'] || 0);

        // Based on current logic (bug), sum should be > 100 because normalization is skipped if sum >= 100.
        // If normalization is skipped:
        // Input: 50, 50, 50, 50 -> sum = 200.
        // Rounded: 50, 50, 50, 50 -> final_add = 200.
        // Logic: if (final_add > 100) -> subtract 10 from minVal (50).
        // Result: 40, 50, 50, 50 -> sum = 190.

        // This test asserts the *correct* behavior, so it should fail if the bug exists.
        expect(sum).toBe(100);
    });
});
