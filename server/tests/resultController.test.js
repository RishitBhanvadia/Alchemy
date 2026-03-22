const { calculateResult } = require('../controllers/resultController');
const supabase = require('../supabaseClient');

jest.mock('../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: null, error: null }), // Mock no data found
}));

describe('resultController', () => {
  it('should return 404 when no reaction data is found', async () => {
    const req = {
      body: {
        chem_a: 50,
        chem_b: 50,
        chem_i: 0,
        chem_c: 0,
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await calculateResult(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: expect.objectContaining({
        code: 'NOT_FOUND'
      })
    }));
  });
});
