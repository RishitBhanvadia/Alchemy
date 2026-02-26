
// Create mocks
const mockEq = jest.fn();
const mockSelect = jest.fn();
const mockFrom = jest.fn();

// The mocked client object
const mockClient = {
    from: mockFrom,
    select: mockSelect,
    eq: mockEq,
    then: (resolve) => resolve({ data: [], error: null })
};

// Set up chaining
mockFrom.mockReturnValue(mockClient);
mockSelect.mockReturnValue(mockClient);
mockEq.mockReturnValue(mockClient);

// Mock the module
jest.mock('@supabase/supabase-js', () => ({
    createClient: () => mockClient
}));

const resultController = require('../controllers/resultController');

describe('resultController Logic', () => {
    let req, res;

    beforeEach(() => {
        // Clear counts
        mockEq.mockClear();
        mockSelect.mockClear();
        mockFrom.mockClear();

        req = {
            params: {
                chem_a: '0',
                chem_b: '0',
                chem_c: '0',
                chem_d: '0'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should handle all zero inputs gracefully (regression test)', async () => {
        await resultController.calculateResult(req, res);

        // Check the arguments passed to .eq()
        const eqCalls = mockEq.mock.calls;

        // Helper to find value for a column
        const getVal = (col) => {
            const call = eqCalls.find(c => c[0] === col);
            return call ? call[1] : undefined;
        };

        const a = getVal('conc_a');
        const b = getVal('conc_b');
        const c = getVal('conc_c');
        const d = getVal('conc_d');
        const id = getVal('reaction_id');

        // Verify values are numbers and not NaN
        expect(Number.isNaN(a)).toBe(false);
        expect(Number.isNaN(b)).toBe(false);
        expect(Number.isNaN(c)).toBe(false);
        expect(Number.isNaN(d)).toBe(false);
        expect(Number.isNaN(id)).toBe(false);

        // Verify values are 0 (The Fix Goal)
        // Currently this fails because logic produces NaN or 10 due to bugs
        expect(a).toBe(0);
        expect(b).toBe(0);
        expect(c).toBe(0);
        expect(d).toBe(0);
        expect(id).toBe(0);
    });

    it('should process valid inputs correctly', async () => {
        req.params = {
            chem_a: '50',
            chem_b: '50',
            chem_c: '0',
            chem_d: '0'
        };

        await resultController.calculateResult(req, res);

        const eqCalls = mockEq.mock.calls;
        const getVal = (col) => {
            const call = eqCalls.find(c => c[0] === col);
            return call ? call[1] : undefined;
        };

        expect(getVal('conc_a')).toBe(50);
        expect(getVal('conc_b')).toBe(50);
        expect(getVal('reaction_id')).toBe(11); // 1 + 10 = 11
    });
});
