const { calculateResult } = require('../controllers/resultController');

const mockReq = (body) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock('../supabaseClient', () => {
  const mockMaybeSingle = jest.fn();
  const mockSingle = jest.fn();
  const mockLimit = jest.fn(() => ({ maybeSingle: mockMaybeSingle }));
  const mockEq = jest.fn(() => ({ eq: mockEq, maybeSingle: mockMaybeSingle, limit: mockLimit, single: mockSingle }));
  const mockSelect = jest.fn(() => ({ eq: mockEq }));
  const mockFrom = jest.fn(() => ({ select: mockSelect }));
  return {
    from: mockFrom,
    __mockMaybeSingle: mockMaybeSingle,
    __mockSingle: mockSingle,
    __mockEq: mockEq
  };
});

const supabase = require('../supabaseClient');

describe('resultController logic', () => {
  it('correctly calculates reaction_id for indicator only', async () => {
    // Normalization logic: a + b + i + c = total
    // So let's pass a=0, b=0, i=100, c=0
    const req = mockReq({ chem_a: 0, chem_b: 0, chem_i: 100, chem_c: 0 });
    const res = mockRes();

    supabase.__mockMaybeSingle.mockResolvedValue({ data: null });
    supabase.__mockSingle.mockResolvedValue({ data: { outcome_label: 'Water' } });

    await calculateResult(req, res);

    expect(res.json).toHaveBeenCalled();
    const result = res.json.mock.calls[0][0];

    // In correct logic: chem_c >= threshold => +100. chem_i >= threshold => +1000.
    // So indicator should be 1000
    expect(result.reaction_id).toBe(1000);
  });
});
