const { calculateResult } = require('../controllers/resultController');
const supabase = require('../supabaseClient');

jest.mock('../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  single: jest.fn().mockResolvedValue({
    data: {
      outcome_label: 'Water',
      product_formula: 'H2O',
      color: 'Colourless',
      state_change: 'None',
      thermal_effect: 'None',
      ai_tutor_context: '',
      is_dangerous: false
    }
  })
}));

describe('resultController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should correctly compute reaction id with indicator=1000 and catalyst=100', async () => {
    // Normalised a=10, b=0, i=90, c=0 -> reaction_id should be 1001 (1 for acid, 1000 for indicator)
    req.body = { chem_a: 10, chem_b: 0, chem_i: 90, chem_c: 0 };
    await calculateResult(req, res);

    // Test should verify the database query used the correct reaction_id
    expect(supabase.eq).toHaveBeenCalledWith('reaction_id', 1001);
  });
});
