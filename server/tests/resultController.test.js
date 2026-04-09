const resultController = require('../controllers/resultController');
const supabase = require('../supabaseClient');

jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock('../supabaseClient', () => {
    return {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
        single: jest.fn().mockResolvedValue({ data: {
            reaction_id: 0,
            outcome_label: 'Water',
            product_formula: 'H2O',
            color: 'Colourless',
            state_change: 'None',
            thermal_effect: 'None',
            ai_tutor_context: 'Just water.',
            is_dangerous: false,
        }, error: null })
    };
});

describe('calculateResult', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate the correct reaction_id using the updated thresholds from shared utils', async () => {
    // If chem_i is 100, the old inline code gave id: 100
    // The shared utility reactionHash gives id: 1000 for chem_i
    const req = { body: { chem_a: 0, chem_b: 0, chem_i: 100, chem_c: 0 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await resultController.calculateResult(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    // Important: check that supabase was queried with the correct hash (1000)
    // The old code would have queried 100, failing this assertion.
    expect(supabase.eq).toHaveBeenCalledWith('reaction_id', 1000);
  });

  it('should use classifyRegime to correctly identify INDICATOR_DOMINANT rather than defaulting to NEUTRAL', async () => {
    // Shared utility sets regime to INDICATOR_DOMINANT when i > 30 and others < 20
    // The old code defaulted this strictly to NEUTRAL
    const req = { body: { chem_a: 0, chem_b: 0, chem_i: 100, chem_c: 0 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await resultController.calculateResult(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(supabase.eq).toHaveBeenCalledWith('regime', 'INDICATOR_DOMINANT');
  });
});
