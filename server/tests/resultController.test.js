const resultController = require('../controllers/resultController');

// Mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock the utils/response functions
jest.mock('../utils/response', () => ({
  success: jest.fn((res, data, statusCode = 200) => res.status(statusCode).json({ success: true, data })),
  error: jest.fn((res, code, message, statusCode) => res.status(statusCode).json({ success: false, error: { code, message } })),
}));

// Mock logger
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Mock supabase client
jest.mock('../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: { outcome_label: 'Water', reaction_id: 0 } }),
  maybeSingle: jest.fn().mockResolvedValue({ data: null }),
}));

describe('resultController.calculateResult', () => {
  it('should return VALIDATION_ERROR wrapper for invalid concentrations', async () => {
    const req = { body: { chem_a: 'invalid', chem_b: 0, chem_c: 0, chem_i: 0 } };
    const res = mockResponse();

    await resultController.calculateResult(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid concentration values. Each must be a number between 0 and 100.'
      }
    });
  });

  it('should return success wrapper with calculation result', async () => {
    const req = { body: { chem_a: 50, chem_b: 50, chem_c: 0, chem_i: 0 } };
    const res = mockResponse();

    await resultController.calculateResult(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
            reaction_id: expect.any(Number),
            regime: expect.any(String),
            outcome_label: expect.any(String)
        })
      })
    );
  });
});
