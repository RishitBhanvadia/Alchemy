const resultController = require('../controllers/resultController');

jest.mock('../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockResolvedValue({ data: null }),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: { outcome_label: 'Water' } }),
}));

describe('Result Controller logic', () => {
  it('should correctly compute reaction id with indicator and catalyst', async () => {
    const req = {
      body: {
        chem_a: 0,
        chem_b: 0,
        chem_i: 100, // purely indicator
        chem_c: 0
      }
    };

    let responseData = null;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => {
        responseData = data;
      })
    };

    await resultController.calculateResult(req, res);

    expect(responseData.reaction_id).toBe(1000);
  });
});
