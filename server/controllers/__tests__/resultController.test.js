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

    // Normalised total: 20 -> na = 50, nb = 0, ni = 50, nc = 0
    // Reaction ID with na >= 5 and ni >= 5 using reactionHash should be 1000 (i) + 1 (a) = 1001.
    // If we duplicate the logic locally incorrectly with 100 instead of 1000 for indicator, it gets 101.
    // The current bug is it duplicates logic AND uses THRESHOLD = 5 instead of 10.

    // Actually the memory note says:
    // "The computeReactionId utility in server/utils/reactionHash.js serves as the canonical source for reaction positional weights (e.g., acid=1, base=10, catalyst=100, indicator=1000) and accepts a configurable threshold parameter. Ensure any context-specific calculations import and use this utility rather than duplicating the logic."

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
