const { calculateResult } = require('../../controllers/resultController');

jest.mock('../../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  single: jest.fn().mockResolvedValue({ data: { outcome_label: "water" }, error: null }),
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Result Controller logic for computeReactionId', () => {
  it('should calculate Indicator ID correctly', async () => {
    const req = { body: { chem_a: 0, chem_b: 0, chem_i: 100, chem_c: 0 } };
    const res = mockResponse();

    await calculateResult(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      reaction_id: 1000 // In reactionHash.js Indicator is 1000
    }));
  });

  it('should calculate Catalyst ID correctly', async () => {
    const req = { body: { chem_a: 0, chem_b: 0, chem_i: 0, chem_c: 100 } };
    const res = mockResponse();

    await calculateResult(req, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      reaction_id: 100 // In reactionHash.js Catalyst is 100
    }));
  });
});
