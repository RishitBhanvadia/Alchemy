const { calculateResult } = require('../controllers/resultController');
const { computeReactionId } = require('../utils/reactionHash');

// Mock supabase to capture what reaction_id is being queried
jest.mock('../supabaseClient', () => {
  const queryBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { outcome_label: 'Water' }, error: null })
  };
  return {
    from: jest.fn(() => queryBuilder)
  };
});

const supabase = require('../supabaseClient');

describe('resultController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should compute the correct reaction_id using the centralized reactionHash', async () => {
    const req = {
      body: {
        chem_a: 50,
        chem_b: 0,
        chem_i: 50, // indicator
        chem_c: 0   // catalyst
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await calculateResult(req, res);

    // Get the instance of the mock
    const queryBuilder = supabase.from('results');

    // Check if eq was called with 'reaction_id' and the correct ID
    // Based on centralized reactionHash: A=1, B=10, C=100, I=1000
    // So for A=50% and I=50%, reaction_id should be 1 + 1000 = 1001
    // The buggy inline code would calculate A=1, I=100 -> 101.
    const expectedId = computeReactionId(50, 0, 50, 0); // 1001

    // Verify the query was made with the correct ID
    const eqCalls = queryBuilder.eq.mock.calls;
    const reactionIdCalls = eqCalls.filter(call => call[0] === 'reaction_id');

    expect(reactionIdCalls[0][1]).toBe(expectedId);
  });
});
