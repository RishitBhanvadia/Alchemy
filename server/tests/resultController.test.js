const { calculateResult } = require('../controllers/resultController');

jest.mock('../supabaseClient', () => ({
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: { result: 'No reaction', product_name: 'None', color: '#ffffff' },
      error: null
    })
  }))
}));

jest.mock('../utils/reactionHash', () => ({
  computeReactionId: jest.fn((a, b, i, c) => {
    // We want to check what arguments were passed to computeReactionId to verify normalization
    return 123;
  }),
  PRESENCE_THRESHOLD: 5
}));

jest.mock('../utils/regimeClassifier', () => ({
  classifyRegime: jest.fn(() => 'A_DOMINANT')
}));

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('calculateResult normalization', () => {
  it('should not assign remaining percentage to chem_c if chem_c was originally 0', async () => {
    const { computeReactionId } = require('../utils/reactionHash');
    computeReactionId.mockClear();

    const req = {
      body: {
        chem_a: 33.3,
        chem_b: 33.3,
        chem_i: 33.3,
        chem_c: 0
      }
    };
    const res = mockRes();

    await calculateResult(req, res);

    expect(res.json).toHaveBeenCalled();
    // It should have called computeReactionId with rounded numbers summing to 100, where c is 0.
    // e.g. 34, 33, 33, 0 or similar
    expect(computeReactionId).toHaveBeenCalled();
    const calls = computeReactionId.mock.calls;
    expect(calls.length).toBe(1);

    const [a, b, i, c] = calls[0];

    // Sum should be 100
    expect(a + b + i + c).toBe(100);
    // chem_c must be exactly 0 since original was 0
    expect(c).toBe(0);
  });
});
