jest.mock('../supabaseClient', () => ({
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
}));

jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const { calculateResult, normaliseForTest } = require('../controllers/resultController');

describe('resultController normalise logic', () => {
  it('should not hallucinate data when normalising values with remainders', () => {
    // 33.3 + 33.3 + 33.3 + 0 = 99.9 (total).
    // The previous implementation would assign the remainder to nc (the 4th value)
    // even though it was originally 0.
    const result = normaliseForTest(33.3, 33.3, 33.3, 0);

    // Result should sum to 100, and since c was 0, it must remain 0!
    // Instead of [33, 33, 33, 1] it should be [34, 33, 33, 0] or similar.
    expect(result[3]).toBe(0);
    const sum = result.reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });
});
