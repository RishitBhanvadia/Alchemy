const mockEq = jest.fn();

// Mock the query chain
const queryBuilder = {
    eq: mockEq,
    then: (resolve) => resolve({ data: [], error: null }) // Start promise chain
};
// Make eq return the builder itself to support chaining
mockEq.mockReturnValue(queryBuilder);

const mockSelect = jest.fn(() => queryBuilder);
const mockFrom = jest.fn(() => ({ select: mockSelect }));
const mockClient = { from: mockFrom };

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => mockClient
}));

const resultController = require('../controllers/resultController');

describe('calculateResult Logic', () => {
    beforeEach(() => {
        mockEq.mockClear();
    });

    test('reproduces rounding issue with 30, 30, 30, 30 (Sum > 100)', async () => {
        const req = {
            params: { chem_a: '30', chem_b: '30', chem_c: '30', chem_d: '30' }
        };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await resultController.calculateResult(req, res);

        const args = getQueryArgs(mockEq);
        const sum = args.conc_a + args.conc_b + args.conc_c + args.conc_d;

        expect(sum).toBe(100);
        expect(args.conc_a).toBe(10);
    });

    test('handles rounding resulting in sum < 100', async () => {
        // 33, 33, 33, 1 -> Sum 100. No normalization.
        // Rounding: 30, 30, 30, 0. Sum 90.
        // Needs +10. MaxVal is 30 (a).
        // Result: 40, 30, 30, 0.
        const req = {
            params: { chem_a: '33', chem_b: '33', chem_c: '33', chem_d: '1' }
        };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await resultController.calculateResult(req, res);

        const args = getQueryArgs(mockEq);
        const sum = args.conc_a + args.conc_b + args.conc_c + args.conc_d;

        expect(sum).toBe(100);
        expect(args.conc_a).toBe(40);
        expect(args.conc_b).toBe(30);
        expect(args.conc_c).toBe(30);
        expect(args.conc_d).toBe(0);
    });

    test('handles exact sum 100 correctly', async () => {
        const req = {
            params: { chem_a: '10', chem_b: '20', chem_c: '30', chem_d: '40' }
        };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await resultController.calculateResult(req, res);

        const args = getQueryArgs(mockEq);
        const sum = args.conc_a + args.conc_b + args.conc_c + args.conc_d;

        expect(sum).toBe(100);
        expect(args.conc_a).toBe(10);
        expect(args.conc_b).toBe(20);
        expect(args.conc_c).toBe(30);
        expect(args.conc_d).toBe(40);
    });

    test('handles 25, 25, 25, 25 correctly (rounding leads to 120)', async () => {
        const req = {
            params: { chem_a: '25', chem_b: '25', chem_c: '25', chem_d: '25' }
        };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await resultController.calculateResult(req, res);

        const args = getQueryArgs(mockEq);
        const sum = args.conc_a + args.conc_b + args.conc_c + args.conc_d;

        expect(sum).toBe(100);
        expect(args.conc_a).toBe(10);
    });
});

function getQueryArgs(mock) {
    const calls = mock.mock.calls;
    const args = {};
    calls.forEach(call => {
        args[call[0]] = call[1];
    });
    return args;
}
