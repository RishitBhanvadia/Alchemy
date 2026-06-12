const { calculateResult } = require('../controllers/resultController');

jest.mock('../supabaseClient', () => {
  return {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    single: jest.fn().mockResolvedValue({ data: { outcome_label: 'Water' } }),
  };
});

describe('resultController', () => {
  it('should use canonical utilities for regime and reactionId instead of outdated duplicates', async () => {
    const req = {
      body: {
        chemA: 5,
        chemB: 5,
        chemC: 90,
        chemI: 0
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await calculateResult(req, res);
    expect(res.json).toHaveBeenCalled();

    const result = res.json.mock.calls[0][0];

    // Asserts expected results based on the new logic
    expect(result.reaction_id).toBe(100);
    expect(result.regime).toBe('CATALYST_DOMINANT');
  });
});
