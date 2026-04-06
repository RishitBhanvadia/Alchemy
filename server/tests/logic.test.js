const { computeReactionId } = require('../utils/reactionHash');
const { classifyRegime } = require('../utils/regimeClassifier');

describe('LogicGuard Verification', () => {
  it('should correctly hash reaction components including indicator and catalyst', () => {
    // Old buggy controller logic ignored proper multipliers for indicator vs catalyst.
    // Let's test the correct logic imported from utils.

    // Acid(10) + Indicator(10) = ID should be 1001
    expect(computeReactionId(10, 0, 10, 0)).toBe(1001);

    // Acid(10) + Catalyst(10) = ID should be 101
    expect(computeReactionId(10, 0, 0, 10)).toBe(101);
  });

  it('should correctly classify regime including indicator and catalyst', () => {
    // Old buggy inline logic ignored indicator and catalyst entirely.

    // Catalyst dominant
    expect(classifyRegime(0, 0, 0, 50)).toBe('CATALYST_DOMINANT');

    // Indicator dominant
    expect(classifyRegime(0, 0, 50, 0)).toBe('INDICATOR_DOMINANT');
  });
});
