const { classifyRegime } = require('../utils/regimeClassifier');
const { computeReactionId } = require('../utils/reactionHash');

describe('Reaction Hash and Regime Classifier Utilities', () => {
  it('computeReactionId correctly calculates ID with indicator and catalyst threshold', () => {
    // Both 100 which is >= 10 threshold
    const id = computeReactionId(0, 0, 100, 100);
    expect(id).toBe(1100);
  });

  it('classifyRegime correctly identifies indicator dominance', () => {
    const regime = classifyRegime(0, 0, 100, 0);
    expect(regime).toBe('INDICATOR_DOMINANT');
  });

  it('classifyRegime correctly identifies catalyst dominance', () => {
    const regime = classifyRegime(0, 0, 0, 100);
    expect(regime).toBe('CATALYST_DOMINANT');
  });
});
