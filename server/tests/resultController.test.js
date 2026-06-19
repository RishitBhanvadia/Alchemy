const { calculateResult } = require('../controllers/resultController');
const supabase = require('../supabaseClient');

jest.mock('../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({
    data: {
      reaction_id: 0,
      regime: 'NEUTRAL',
      outcome_label: 'Water',
      product_formula: 'H2O'
    }
  })
}));

describe('resultController', () => {
  it('correctly computes reactionId for catalyst and indicator', async () => {
    const req = {
      body: {
        chem_a: 0,
        chem_b: 0,
        chem_c: 100,
        chem_i: 0
      }
    };

    let responseData;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        responseData = data;
      })
    };

    await calculateResult(req, res);

    // For chem_c = 100, reactionId should be 100
    // If bug exists, it might be 1000
    expect(responseData.reaction_id).toBe(100);
  });
});
