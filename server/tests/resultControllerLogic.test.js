const { calculateResult } = require('../controllers/resultController');

// We need to intercept the supabase query or the json response
jest.mock('../supabaseClient', () => {
  return {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { outcome_label: 'Water' } })
  };
});

describe('Result Controller Logic', () => {
  it('should compute the correct reaction_id mapping indicator to 1000 and catalyst to 100', async () => {
    const req = {
      body: {
        chemA: 5,   // acid
        chemB: 0,   // base
        chemI: 95,  // indicator
        chemC: 0    // catalyst
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await calculateResult(req, res);

    // With 5% acid and 95% indicator:
    // a = 5, b = 0, i = 95, c = 0
    // If threshold = 5%:
    // ID should be 1 (acid) + 1000 (indicator) = 1001.
    // If the buggy computeReactionId is used, it will do i = 100 -> ID = 101.

    expect(res.json).toHaveBeenCalled();
    const result = res.json.mock.calls[0][0];
    expect(result.reaction_id).toBe(1001);
  });
});
