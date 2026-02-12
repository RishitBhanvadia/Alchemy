const mockEq = jest.fn();
const mockSelect = jest.fn();
const mockFrom = jest.fn();

// We need a way to mock the return value of the chain.
// Since the controller awaits the result of the chain, the last method called (eq) must behave like a Promise.
// But eq is called multiple times.
// We can use a recursive mock or a persistent object.

const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    then: function(resolve, reject) {
        // Resolve with the data set on this object, or empty array
        resolve({ data: this.data || [], error: this.error || null });
    },
    // Helper for tests to set the response
    setResult: function(data, error) {
        this.data = data;
        this.error = error;
    }
};

const mockSupabaseClient = {
    from: jest.fn(() => mockQueryBuilder)
};

// Mock the module BEFORE requiring the controller
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => mockSupabaseClient)
}));

const resultController = require('../controllers/resultController');

describe('Result Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { params: {} };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis() // Chainable status
        };
        // Reset mocks
        mockQueryBuilder.setResult([], null);
        mockQueryBuilder.select.mockClear();
        mockQueryBuilder.eq.mockClear();
        mockSupabaseClient.from.mockClear();
        res.json.mockClear();
        res.status.mockClear();
    });

    test('should return correct values for simple inputs summing to 100', async () => {
        // 20, 30, 20, 30 = 100
        req.params = { chem_a: '20', chem_b: '30', chem_c: '20', chem_d: '30' };
        mockQueryBuilder.setResult([{ result: 'success' }], null);

        await resultController.calculateResult(req, res);

        expect(mockSupabaseClient.from).toHaveBeenCalledWith('results');

        // Check calls to eq. Order matters in calls array, but logic order is:
        // conc_a, conc_b, conc_c, conc_d, reaction_id
        // The implementation calls eq('conc_a', a) ...

        // We can check specific calls.
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_a', 20);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_b', 30);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_c', 20);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_d', 30);

        // Reaction ID calculation:
        // a=20 (!=0) -> +1
        // b=30 (!=0) -> +10
        // c=20 (!=0) -> +100
        // d=30 (!=0) -> +1000
        // Total 1111
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('reaction_id', 1111);

        expect(res.json).toHaveBeenCalledWith([{ result: 'success' }]);
    });

    test('should normalize inputs summing to < 100 (Normalization Logic)', async () => {
        // 10, 10, 10, 10 -> Sum 40.
        // Normalize: (10/40)*100 = 25.
        // Round: 25 -> 30 (Math.round(2.5)*10)
        // Sum of rounded: 120.
        // Adjustment: Sum > 100.
        // minVals are all 30.
        // Subtracts 10 from a (first minVal).
        // Result: 20, 30, 30, 30.

        req.params = { chem_a: '10', chem_b: '10', chem_c: '10', chem_d: '10' };

        await resultController.calculateResult(req, res);

        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_a', 20);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_b', 30);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_c', 30);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_d', 30);

        // ID: 20(!=0) + 30(!=0) + 30(!=0) + 30(!=0) -> 1+10+100+1000 = 1111
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('reaction_id', 1111);
    });

    test('should handle inputs needing rounding adjustment (Sum < 100 after rounding)', async () => {
        // 33, 33, 33, 0. Sum 99.
        // Normalize: 99 < 100.
        // a = (33/99)*100 = 33.333...
        // b = 33.333...
        // c = 33.333...
        // d = 0
        // Round:
        // a -> 30 (3.33 -> 3)
        // b -> 30
        // c -> 30
        // d -> 0
        // Sum rounded: 90.
        // Adjustment: Sum < 100.
        // maxVals are 30 (a, b, c).
        // Adds 10 to a (first maxVal).
        // Result: 40, 30, 30, 0.

        req.params = { chem_a: '33', chem_b: '33', chem_c: '33', chem_d: '0' };

        await resultController.calculateResult(req, res);

        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_a', 40);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_b', 30);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_c', 30);
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('conc_d', 0);

        // ID: 40(!=0) + 30(!=0) + 30(!=0) + 0(==0) -> 1+10+100+0 = 111
        expect(mockQueryBuilder.eq).toHaveBeenCalledWith('reaction_id', 111);
    });

    test('should fail gracefully or throw error when inputs are all zero (Division by Zero)', async () => {
        req.params = { chem_a: '0', chem_b: '0', chem_c: '0', chem_d: '0' };

        // Current implementation likely results in NaN or DB error.
        // We want to improve this to return a specific error.

        await resultController.calculateResult(req, res);

        // Expectation for the improvement:
        // Should respond with status 400 and message about zero sum.
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
             message: expect.stringMatching(/total.*zero/i)
        }));
    });
});
