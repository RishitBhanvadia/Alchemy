const { classifyRegime } = require('../utils/regimeClassifier');
const { computeReactionId } = require('../utils/reactionHash');

describe('Reaction Utilities', () => {
  test('classifies CATALYST_DOMINANT correctly', () => {
    expect(classifyRegime(10, 5, 0, 85)).toBe('CATALYST_DOMINANT');
  });

  test('computes Reaction ID with catalyst correctly', () => {
    // 10% acid -> +1
    // 5% base (<10) -> 0
    // 85% catalyst -> +100
    // Total = 101
    expect(computeReactionId(10, 5, 0, 85)).toBe(101);
  });

  test('classifies INDICATOR_DOMINANT correctly', () => {
    expect(classifyRegime(5, 5, 90, 0)).toBe('INDICATOR_DOMINANT');
  });

  test('classifies ACID_DOMINANT correctly', () => {
    expect(classifyRegime(80, 10, 5, 5)).toBe('ACID_DOMINANT');
  });

  test('classifies BASE_DOMINANT correctly', () => {
    expect(classifyRegime(10, 80, 5, 5)).toBe('BASE_DOMINANT');
  });

  test('classifies NEUTRAL correctly', () => {
    expect(classifyRegime(45, 45, 5, 5)).toBe('NEUTRAL');
  });
});
