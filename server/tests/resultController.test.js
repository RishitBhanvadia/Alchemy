
const resultControllerPath = '../controllers/resultController';

describe('Result Controller Logic', () => {
    let resultController;
    let mockEq, mockSelect, mockFrom, req, res;

    beforeEach(() => {
        jest.resetModules();

        mockEq = jest.fn();
        mockSelect = jest.fn(() => ({ eq: mockEq }));
        mockFrom = jest.fn(() => ({ select: mockSelect }));

        // Mock chainable eq
        mockEq.mockImplementation(function() {
            return {
                eq: mockEq,
                then: (resolve) => resolve({ data: [], error: null })
            };
        });

        jest.doMock('@supabase/supabase-js', () => ({
            createClient: () => ({
                from: mockFrom
            })
        }));

        resultController = require(resultControllerPath);

        req = {
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('should normalize 23, 23, 23, 23 to sum exactly 100', async () => {
        req.params = { chem_a: 23, chem_b: 23, chem_c: 23, chem_d: 23 };

        const capturedValues = {};
        mockEq.mockImplementation((field, value) => {
            if (typeof field === 'string' && field.startsWith('conc_')) {
                capturedValues[field] = value;
            }
            return {
                eq: mockEq,
                then: (resolve) => resolve({ data: [], error: null })
            };
        });

        await resultController.calculateResult(req, res);

        expect(res.json).toHaveBeenCalled();

        const sum = (capturedValues['conc_a'] || 0) +
                    (capturedValues['conc_b'] || 0) +
                    (capturedValues['conc_c'] || 0) +
                    (capturedValues['conc_d'] || 0);

        // 23, 23, 23, 23 -> sum 92.
        // Normalized: 25, 25, 25, 25.
        // Rounded: 30, 30, 30, 30 (sum 120).
        // Current logic: max is 30. Subtract 10 from one (logic says min, but all equal).
        // Expected with current bug: 110.
        // Desired: 100.

        expect(sum).toBe(100);
    });
});
