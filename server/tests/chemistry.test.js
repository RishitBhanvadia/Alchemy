
const resultController = require('../controllers/resultController');

// We need to mock the entire supabase module to control the client instance
jest.mock('@supabase/supabase-js', () => {
    const mockEq = jest.fn();
    // Make the chain work recursively
    mockEq.mockImplementation(function() { return this; });
    // Add a 'then' method to simulate a Promise
    mockEq.mockReturnValue({
        eq: mockEq,
        then: (resolve) => resolve({ data: [], error: null })
    });

    const mockSelect = jest.fn(() => ({ eq: mockEq }));
    const mockFrom = jest.fn(() => ({ select: mockSelect }));

    return {
        createClient: () => ({
            from: mockFrom
        })
    };
});

// Import the mocked module to inspect it
const supabase = require('@supabase/supabase-js');

describe('Chemistry Logic Reproduction & Verification', () => {
    let req, res;

    beforeEach(() => {
        jest.resetModules(); // crucial to get a fresh controller

        req = { params: {} };
        res = {
            json: jest.fn(),
            status: jest.fn(() => res) // Chainable
        };
    });

    test('FIX: calculateResult with all zeros should NOT result in NaN queries', async () => {
        // Setup specific mock for this test
        const mockEq = jest.fn();
        const queryChain = {
            eq: mockEq,
            then: (resolve) => resolve({ data: [], error: null })
        };
        mockEq.mockReturnValue(queryChain);

        const mockSelect = jest.fn(() => queryChain);
        const mockFrom = jest.fn(() => ({ select: mockSelect }));

        // Re-require the controller with the new mock behavior
        jest.doMock('@supabase/supabase-js', () => ({
            createClient: () => ({
                from: mockFrom
            })
        }));

        const controller = require('../controllers/resultController');

        req.params = { chem_a: '0', chem_b: '0', chem_c: '0', chem_d: '0' };

        await controller.calculateResult(req, res);

        // Check all calls to .eq()
        const calls = mockEq.mock.calls;

        console.log('Supabase .eq calls:', calls);

        // Verify no NaN was passed
        const hasNaN = calls.some(call => Number.isNaN(call[1]));
        expect(hasNaN).toBe(false);

        // Verify specifically that we queried for 0, 0, 0, 0
        // Calls are: [conc_a, 0], [conc_b, 0], ...
        expect(calls[0]).toEqual(['conc_a', 0]);
        expect(calls[1]).toEqual(['conc_b', 0]);
        expect(calls[2]).toEqual(['conc_c', 0]);
        expect(calls[3]).toEqual(['conc_d', 0]);
        expect(calls[4]).toEqual(['reaction_id', 0]);

        expect(res.status).not.toHaveBeenCalledWith(500);
    });

    test('Normal case: 10, 10, 10, 10 -> normalizes to 25, 25, 25, 25', async () => {
         const mockEq = jest.fn();
        const queryChain = {
            eq: mockEq,
            then: (resolve) => resolve({ data: [], error: null })
        };
        mockEq.mockReturnValue(queryChain);
        const mockSelect = jest.fn(() => queryChain);
        const mockFrom = jest.fn(() => ({ select: mockSelect }));

        jest.doMock('@supabase/supabase-js', () => ({
            createClient: () => ({ from: mockFrom })
        }));

        const controller = require('../controllers/resultController');

        req.params = { chem_a: '10', chem_b: '10', chem_c: '10', chem_d: '10' };
        // Sum = 40. Normalization: each becomes (10/40)*100 = 25.
        // Rounding: 25 rounds to 30? Math.round(25/10)*10 = 3*10 = 30?
        // Wait, logic says: Math.round(val/10)*10.
        // 25/10 = 2.5. Math.round(2.5) is 3 (ties round up in JS usually? No, round(2.5) -> 3).
        // So 30, 30, 30, 30 => Sum 120.
        // Logic adjusts sum > 100.
        // It subtracts 10 from min values until sum is 100.
        // Min val is 30 for all.
        // It will subtract 10 from a -> 20. Sum 110.
        // Then subtract 10 from b -> 20. Sum 100.
        // Result: 20, 20, 30, 30. (Order might vary depending on minVal logic details)

        await controller.calculateResult(req, res);

        const calls = mockEq.mock.calls;
        // Verify sum is 100
        const a = calls[0][1];
        const b = calls[1][1];
        const c = calls[2][1];
        const d = calls[3][1];
        expect(a + b + c + d).toBe(100);
    });

    test('Rounding up case: 2, 2, 2, 2 -> Normalizes to 25s, same as above', async () => {
         const mockEq = jest.fn();
        const queryChain = {
            eq: mockEq,
            then: (resolve) => resolve({ data: [], error: null })
        };
        mockEq.mockReturnValue(queryChain);
        const mockSelect = jest.fn(() => queryChain);
        const mockFrom = jest.fn(() => ({ select: mockSelect }));

        jest.doMock('@supabase/supabase-js', () => ({
            createClient: () => ({ from: mockFrom })
        }));

        const controller = require('../controllers/resultController');

        // 2, 2, 2, 2 sum=8. (2/8)*100 = 25. Same result as above.
        req.params = { chem_a: '2', chem_b: '2', chem_c: '2', chem_d: '2' };
        await controller.calculateResult(req, res);

        const calls = mockEq.mock.calls;
        const sum = calls[0][1] + calls[1][1] + calls[2][1] + calls[3][1];
        expect(sum).toBe(100);
    });

    test('Invalid Input: string instead of number', async () => {
        const controller = require('../controllers/resultController');
        req.params = { chem_a: 'abc', chem_b: '0', chem_c: '0', chem_d: '0' };

        await controller.calculateResult(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
             message: expect.stringMatching(/Invalid number/)
        }));
    });
});
