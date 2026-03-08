const resultController = require('../controllers/resultController');

// Define mock functions inline in jest.mock due to hoisting
jest.mock('@supabase/supabase-js', () => {
    const mockEq = jest.fn();
    const eqChain = { eq: mockEq };
    mockEq.mockReturnValue(eqChain);
    eqChain.then = jest.fn((callback) => callback({ data: [{ result_name: 'Success' }], error: null }));

    return {
        createClient: jest.fn(() => ({
            from: jest.fn(() => ({
                select: jest.fn(() => eqChain)
            }))
        })),
        _mockEq: mockEq // Expose for assertions
    };
});

describe('Result Controller Logic', () => {
    let res;
    let mockEq;

    beforeEach(() => {
        const supabase = require('@supabase/supabase-js');
        mockEq = supabase._mockEq;
        mockEq.mockClear();
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it('should sum exactly to 100 for inputs (25, 25, 25, 25)', async () => {
        const req = { params: { chem_a: '25', chem_b: '25', chem_c: '25', chem_d: '25' } };

        await resultController.calculateResult(req, res);

        let sum = 0;
        mockEq.mock.calls.forEach(call => {
            if (['conc_a', 'conc_b', 'conc_c', 'conc_d'].includes(call[0])) {
                sum += call[1];
            }
        });

        expect(sum).toBe(100);
    });

    it('should handle all zeros (0, 0, 0, 0) without returning NaN', async () => {
        const req = { params: { chem_a: '0', chem_b: '0', chem_c: '0', chem_d: '0' } };

        await resultController.calculateResult(req, res);

        let sum = 0;
        let isNaNValue = false;
        mockEq.mock.calls.forEach(call => {
            if (['conc_a', 'conc_b', 'conc_c', 'conc_d'].includes(call[0])) {
                if (Number.isNaN(call[1])) isNaNValue = true;
                sum += call[1];
            }
        });

        expect(isNaNValue).toBe(false);
        expect(sum).toBe(0);
    });
});
