// Mock dependencies before requiring the controller
jest.mock('@supabase/supabase-js');
const { createClient } = require('@supabase/supabase-js');

// Setup mocks
const mockEq = jest.fn();
const mockSelect = jest.fn();
const mockFrom = jest.fn();

const mockBuilder = {
    then: (resolve) => resolve({ data: [], error: null }) // Default implementation
};

// Circular reference for chaining
mockBuilder.eq = mockEq;
mockBuilder.select = mockSelect;

// Setup return values
mockEq.mockReturnValue(mockBuilder);
mockSelect.mockReturnValue(mockBuilder);
mockFrom.mockReturnValue(mockBuilder);

// Configure createClient to return our mock structure
createClient.mockReturnValue({
    from: mockFrom
});

// Now require the controller
const resultController = require('../controllers/resultController');

describe('Result Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Clear mock history
        mockEq.mockClear();
        mockSelect.mockClear();
        mockFrom.mockClear();

        // Reset default mock implementation
        mockBuilder.then = (resolve) => resolve({ data: [], error: null });
    });

    test('should return 400 if a parameter is missing', async () => {
        req.params = { chem_a: '10', chem_b: '20', chem_c: '30' }; // missing chem_d
        await resultController.calculateResult(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing parameter: chem_d' });
    });

    test('should return 400 if a parameter is not a number', async () => {
        req.params = { chem_a: '10', chem_b: '20', chem_c: '30', chem_d: 'abc' };
        await resultController.calculateResult(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid number for: chem_d' });
    });

    test('should return 400 if a parameter is out of range', async () => {
        req.params = { chem_a: '10', chem_b: '20', chem_c: '30', chem_d: '110' };
        await resultController.calculateResult(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Value out of range (0-100) for: chem_d' });
    });

    test('should calculate correct result for valid inputs (simple case)', async () => {
        req.params = { chem_a: '10', chem_b: '20', chem_c: '30', chem_d: '40' };
        // 10+20+30+40 = 100.
        // Reaction ID: 1 + 10 + 100 + 1000 = 1111.

        await resultController.calculateResult(req, res);

        expect(mockFrom).toHaveBeenCalledWith('results');
        expect(mockSelect).toHaveBeenCalledWith('*');

        expect(mockEq).toHaveBeenCalledWith('conc_a', 10);
        expect(mockEq).toHaveBeenCalledWith('conc_b', 20);
        expect(mockEq).toHaveBeenCalledWith('conc_c', 30);
        expect(mockEq).toHaveBeenCalledWith('conc_d', 40);
        expect(mockEq).toHaveBeenCalledWith('reaction_id', 1111);

        expect(res.json).toHaveBeenCalledWith([]);
    });

    test('should normalize inputs that sum to less than 100', async () => {
        req.params = { chem_a: '5', chem_b: '10', chem_c: '15', chem_d: '20' };
        // Sum = 50.
        // Normalize: (5/50)*100=10, (10/50)*100=20, (15/50)*100=30, (20/50)*100=40.
        // Reaction ID: 1111.

        await resultController.calculateResult(req, res);

        expect(mockEq).toHaveBeenCalledWith('conc_a', 10);
        expect(mockEq).toHaveBeenCalledWith('conc_b', 20);
        expect(mockEq).toHaveBeenCalledWith('conc_c', 30);
        expect(mockEq).toHaveBeenCalledWith('conc_d', 40);
        expect(mockEq).toHaveBeenCalledWith('reaction_id', 1111);
    });

    test('should handle rounding adjustments (sum < 100)', async () => {
        // Case where rounding down causes sum < 100.
        // 33, 33, 33, 1 -> Sum 100.
        // Rounding: 30, 30, 30, 0. Sum = 90.
        // Adjustment: max value (30) gets +10 -> 40.
        // Result: 40, 30, 30, 0.

        req.params = { chem_a: '33', chem_b: '33', chem_c: '33', chem_d: '1' };

        await resultController.calculateResult(req, res);

        // Wait, which one gets +10?
        // Logic: if (a === maxVal) a += 10;
        // a=30, b=30, c=30. a is checked first.

        expect(mockEq).toHaveBeenCalledWith('conc_a', 40);
        expect(mockEq).toHaveBeenCalledWith('conc_b', 30);
        expect(mockEq).toHaveBeenCalledWith('conc_c', 30);
        expect(mockEq).toHaveBeenCalledWith('conc_d', 0);

        // Reaction ID: 40!=0 -> +1, 30!=0 -> +10, 30!=0 -> +100, 0==0 -> 0. Total: 111.
        expect(mockEq).toHaveBeenCalledWith('reaction_id', 111);
    });

    test('should handle rounding adjustments (sum > 100)', async () => {
        // Case where rounding up causes sum > 100.
        // 26, 26, 26, 22 -> Sum 100.
        // Rounding: 30, 30, 30, 20. Sum = 110.
        // Adjustment: min value (20) gets -10 -> 10.
        // Result: 30, 30, 30, 10.

        req.params = { chem_a: '26', chem_b: '26', chem_c: '26', chem_d: '22' };

        await resultController.calculateResult(req, res);

        expect(mockEq).toHaveBeenCalledWith('conc_a', 30);
        expect(mockEq).toHaveBeenCalledWith('conc_b', 30);
        expect(mockEq).toHaveBeenCalledWith('conc_c', 30);
        expect(mockEq).toHaveBeenCalledWith('conc_d', 10);
        expect(mockEq).toHaveBeenCalledWith('reaction_id', 1111);
    });

    test('should handle database errors', async () => {
        req.params = { chem_a: '10', chem_b: '20', chem_c: '30', chem_d: '40' };

        // Mock error
        mockBuilder.then = (resolve) => resolve({ data: null, error: 'Database Error' });

        await resultController.calculateResult(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Database Error' });
    });
});
