const { calculateResult } = require('../controllers/resultController');
const supabase = require('../supabaseClient');

jest.mock('../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockResolvedValue({ data: null }),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: { reaction_id: 0, outcome_label: 'Water' } }),
}));

jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn()
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

  it('computes correct reaction ID for acid and catalyst (no indicator)', async () => {
    req.body = { chem_a: 50, chem_b: 0, chem_i: 0, chem_c: 50 };
    await calculateResult(req, res);

    const response = res.json.mock.calls[0][0];

    // a=50, c=50, i=0
    // id should be 1 (for a) + 100 (for c) + 0 (for i) = 101
    expect(response.reaction_id).toBe(101);
  });

  it('computes correct reaction ID for acid and indicator (no catalyst)', async () => {
    req.body = { chem_a: 50, chem_b: 0, chem_i: 50, chem_c: 0 };
    await calculateResult(req, res);

    const responseObj = res.json.mock.calls[0][0];

    // a=50, i=50, c=0
    // id should be 1 (for a) + 1000 (for i) + 0 (for c) = 1001
    expect(responseObj.reaction_id).toBe(1001);
  });
});
