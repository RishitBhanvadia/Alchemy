const { calculateResult } = require('../controllers/resultController');

jest.mock('../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn(),
  single: jest.fn(),
}));

jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const supabase = require('../supabaseClient');

describe('resultController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('should return 400 if input values are invalid', async () => {
    req.body = { chem_a: -10 };
    await calculateResult(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should calculate algorithmic result for neutralization', async () => {
    req.body = { chem_a: 50, chem_b: 50 };
    supabase.maybeSingle.mockResolvedValue({ data: null });
    supabase.single.mockResolvedValue({ data: { outcome_label: 'Water' } });

    await calculateResult(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      outcome_label: 'Algorithmic Neutralization'
    }));
  });

  it('should handle database result', async () => {
    req.body = { chem_a: 100 };
    supabase.maybeSingle.mockResolvedValueOnce({
      data: { outcome_label: 'Strong Acid' }
    });

    await calculateResult(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      outcome_label: 'Strong Acid'
    }));
  });

  it('should fallback to water if no other data', async () => {
    req.body = { chem_a: 0, chem_b: 0 };
    supabase.maybeSingle.mockResolvedValue({ data: null });
    supabase.single.mockResolvedValue({
      data: { outcome_label: 'Water' }
    });

    await calculateResult(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      outcome_label: 'Water'
    }));
  });

  it('should handle 500 server error', async () => {
    req.body = { chem_a: 50 };
    supabase.maybeSingle.mockRejectedValue(new Error('DB Error'));

    await calculateResult(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
