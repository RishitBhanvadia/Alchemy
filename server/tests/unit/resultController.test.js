const { calculateResult } = require('../../controllers/resultController');

jest.mock('../../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Result Controller Logic', () => {
  it('should correctly handle normalisation and computeReactionId logic', async () => {
    // 100/100/0/0 should become 50/50/0/0
    const req = { body: { chem_a: 100, chem_b: 100, chem_i: 0, chem_c: 0 } };
    const res = mockResponse();

    await calculateResult(req, res);

    // We expect normalise to divide by total, so a=50, b=50.
    // Reaction ID uses threshold of 5%. 50 is >= 5, so id += 1 for a, id += 10 for b => 11.
    // Since mock Supabase returns no data, it'll fall through to algorithmic.
    expect(res.status).toHaveBeenCalledWith(200);
    // Let's inspect the returned body
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      reaction_id: 11
    }));
  });
});
