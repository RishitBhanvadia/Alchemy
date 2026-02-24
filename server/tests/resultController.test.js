
const resultController = require('../controllers/resultController');

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
    const mockEq = jest.fn();
    mockEq.mockImplementation(function() { return { eq: mockEq }; });

    const mockSelect = jest.fn(() => ({ eq: mockEq }));

    return {
        createClient: jest.fn(() => ({
            from: jest.fn(() => ({
                select: mockSelect
            }))
        })),
        getMockEq: () => mockEq
    };
});

const { getMockEq } = require('@supabase/supabase-js');

describe('calculateResult Logic', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {}
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        jest.clearAllMocks();
        getMockEq().mockClear();
    });

    test('Input 0,0,0,0 should NOT result in NaN and return 0s', async () => {
        req.params = { chem_a: 0, chem_b: 0, chem_c: 0, chem_d: 0 };

        await resultController.calculateResult(req, res);

        const mockEq = getMockEq();
        const calls = mockEq.mock.calls;
        console.log('Calls for 0,0,0,0:', calls);

        const hasNaN = calls.some(call => Number.isNaN(call[1]));
        expect(hasNaN).toBe(false);

        // Verify values are 0
        // Assumes order or inspecting all calls
        const values = calls.map(c => c[1]);
        // Expect at least 4 zeros (conc_a...d)
        const zeros = values.filter(v => v === 0);
        expect(zeros.length).toBeGreaterThanOrEqual(4);
    });

    test('Input 24,24,24,24 should result in sum === 100', async () => {
        req.params = { chem_a: 24, chem_b: 24, chem_c: 24, chem_d: 24 };

        await resultController.calculateResult(req, res);

        const mockEq = getMockEq();
        const calls = mockEq.mock.calls;
        console.log('Calls for 24,24,24,24:', calls);

        const values = {};
        calls.forEach(call => {
            if (['conc_a', 'conc_b', 'conc_c', 'conc_d'].includes(call[0])) {
                values[call[0]] = call[1];
            }
        });

        const sum = (values.conc_a || 0) + (values.conc_b || 0) + (values.conc_c || 0) + (values.conc_d || 0);
        console.log('Calculated sum sent to DB:', sum);

        expect(sum).toBe(100);
    });

    test('Input 35,35,15,15 should result in sum === 100 (test > 100 adjustment)', async () => {
        // Norm: 35,35,15,15.
        // Round: 40, 40, 20, 20. Sum 120.
        // Should reduce max (40) -> 30, 40, 20, 20 (Sum 110)
        // Should reduce max (40) -> 30, 30, 20, 20 (Sum 100)

        req.params = { chem_a: 35, chem_b: 35, chem_c: 15, chem_d: 15 };

        await resultController.calculateResult(req, res);

        const mockEq = getMockEq();
        const calls = mockEq.mock.calls;

        const values = {};
        calls.forEach(call => {
            if (['conc_a', 'conc_b', 'conc_c', 'conc_d'].includes(call[0])) {
                values[call[0]] = call[1];
            }
        });

        const sum = (values.conc_a || 0) + (values.conc_b || 0) + (values.conc_c || 0) + (values.conc_d || 0);
        console.log('Calculated sum for 35,35,15,15:', sum);

        expect(sum).toBe(100);
    });
});
