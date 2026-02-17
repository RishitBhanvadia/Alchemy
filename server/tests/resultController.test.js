const { createClient } = require('@supabase/supabase-js');

// 1. Mock the module factory (hoisted)
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));

// 2. Define mock functions for assertions
const mockEq = jest.fn();
const mockSelect = jest.fn();
const mockFrom = jest.fn();

// 3. Configure the mock implementation BEFORE requiring the controller
// Since the controller calls createClient() at the top level, we must set the return value now.
createClient.mockReturnValue({
    from: mockFrom
});

// 4. Require the controller
const resultController = require('../controllers/resultController');

describe('resultController.calculateResult', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    // Default chain setup
    mockFrom.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ eq: mockEq });

    // We need a robust chain for the default case, but individual tests will override
    mockEq.mockReturnValue({ eq: mockEq });

    req = {
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('should return 400 if a parameter is missing', async () => {
    req.params = { chem_a: '10', chem_b: '20', chem_c: '30' }; // chem_d missing
    await resultController.calculateResult(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Missing parameter') }));
  });

  test('should return 400 if a parameter is not a number', async () => {
    req.params = { chem_a: '10', chem_b: 'abc', chem_c: '30', chem_d: '40' };
    await resultController.calculateResult(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Invalid number') }));
  });

  test('should return 400 if a parameter is out of range', async () => {
    req.params = { chem_a: '10', chem_b: '101', chem_c: '30', chem_d: '40' };
    await resultController.calculateResult(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Value out of range') }));
  });

  test('should process valid inputs (sum=100) and query Supabase', async () => {
    // Inputs sum to 100: 25, 25, 25, 25
    req.params = { chem_a: '25', chem_b: '25', chem_c: '25', chem_d: '25' };

    // Mock Supabase return value
    const mockData = [{ id: 1, result_name: 'Success' }];
    const mockResult = Promise.resolve({ data: mockData, error: null });

    // Reset default mockEq behavior to handle the chain
    mockEq.mockReset();

    // Helper to create a chainable object
    const chain = { eq: mockEq };

    mockFrom.mockReturnValue({ select: jest.fn().mockReturnValue(chain) });

    // Logic: .eq() is called 5 times.
    // 1 -> chain
    // 2 -> chain
    // 3 -> chain
    // 4 -> chain
    // 5 -> Promise(result)

    mockEq
        .mockReturnValueOnce(chain)
        .mockReturnValueOnce(chain)
        .mockReturnValueOnce(chain)
        .mockReturnValueOnce(chain)
        .mockReturnValueOnce(mockResult);

    await resultController.calculateResult(req, res);

    expect(mockFrom).toHaveBeenCalledWith('results');
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('should normalize inputs summing to < 100', async () => {
      // Inputs: 10, 10, 10, 10 -> Sum 40.
      // Normalize: (10/40)*100 = 25.
      // So all become 25.

      req.params = { chem_a: '10', chem_b: '10', chem_c: '10', chem_d: '10' };

      const mockData = [{ id: 2, result_name: 'Normalized' }];
      const mockResult = Promise.resolve({ data: mockData, error: null });

      mockEq.mockReset();
      const chain = { eq: mockEq };
      mockFrom.mockReturnValue({ select: jest.fn().mockReturnValue(chain) });

      mockEq
          .mockReturnValueOnce(chain)
          .mockReturnValueOnce(chain)
          .mockReturnValueOnce(chain)
          .mockReturnValueOnce(chain)
          .mockReturnValueOnce(mockResult);

      await resultController.calculateResult(req, res);

      expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test('should return 400 if sum of all inputs is 0', async () => {
    req.params = { chem_a: '0', chem_b: '0', chem_c: '0', chem_d: '0' };
    await resultController.calculateResult(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Total concentration cannot be zero') }));
  });
});
