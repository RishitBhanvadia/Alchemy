const { calculateResult } = require('../controllers/resultController');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

jest.mock('../utils/response', () => ({
  success: jest.fn(),
  error: jest.fn()
}));

const mockSelect = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockReturnThis();
const mockLimit = jest.fn().mockReturnThis();
const mockSingle = jest.fn().mockResolvedValue({ data: { result: 'Test reaction' }, error: null });

jest.mock('../supabaseClient', () => {
  return {
    from: jest.fn(() => ({
      select: mockSelect,
      eq: mockEq,
      limit: mockLimit,
      single: mockSingle
    }))
  };
});

describe('Result Controller rounding edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should iteratively reduce deficit to prevent unbalanced subtraction', async () => {
    const { success } = require('../utils/response');

    const req = mockRequest({
      body: {
        chem_a: 33.5,
        chem_b: 33.5,
        chem_i: 33.0,
        chem_c: 0
      }
    });
    const res = mockResponse();

    await calculateResult(req, res);

    expect(success).toHaveBeenCalled();
    const result = success.mock.calls[0][1];
    expect(result.score).toBeDefined();
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});
