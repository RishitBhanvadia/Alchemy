jest.mock('../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockResolvedValue({ data: null }),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: { outcome_label: 'Water' } }),
}));

const resultController = require('../controllers/resultController');
const supabase = require('../supabaseClient');

describe('Result Controller Logic', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should use correct positional weights for catalyst and indicator', async () => {
    // 10% acid, 0 base, 0 indicator, 90% catalyst
    req.body = {
      chem_a: 10,
      chem_b: 0,
      chem_i: 0,
      chem_c: 90
    };

    await resultController.calculateResult(req, res);

    // reaction_id should be 1 (acid) + 100 (catalyst) = 101
    expect(supabase.eq).toHaveBeenCalledWith('reaction_id', 101);
  });

  it('should correctly calculate indicator weight', async () => {
    // 10% acid, 0 base, 90% indicator, 0 catalyst
    req.body = {
      chem_a: 10,
      chem_b: 0,
      chem_i: 90,
      chem_c: 0
    };

    await resultController.calculateResult(req, res);

    // reaction_id should be 1 (acid) + 1000 (indicator) = 1001
    expect(supabase.eq).toHaveBeenCalledWith('reaction_id', 1001);
  });
});
