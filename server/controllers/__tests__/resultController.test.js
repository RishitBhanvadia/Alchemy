const { calculateResult } = require('../resultController');
const supabase = require('../../supabaseClient');

jest.mock('../../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  limit: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: { outcome_label: 'Water' } })
}));

describe('resultController logic', () => {
  it('should compute the correct reaction ID and weights using utils/reactionHash', async () => {
    const req = {
      body: {
        chem_a: 10,
        chem_b: 0,
        chem_i: 10,
        chem_c: 0
      }
    };

    const jsonMock = jest.fn();
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock
    };

    await calculateResult(req, res);

    // Verify that the correct reaction_id (1001) was queried in the database
    expect(supabase.eq).toHaveBeenCalledWith('reaction_id', 1001);
  });
});
