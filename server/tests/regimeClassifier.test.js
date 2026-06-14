const { classifyRegime } = require('../utils/regimeClassifier');

describe('classifyRegime', () => {
  it('should return CATALYST_DOMINANT when chem_c > 20 and acidBaseSum < 20', () => {
    expect(classifyRegime(5, 5, 0, 30)).toBe('CATALYST_DOMINANT');
  });

  it('should return INDICATOR_DOMINANT when chem_i > 30 and acidBaseSum < 20 and chem_c < 20', () => {
    expect(classifyRegime(5, 5, 40, 10)).toBe('INDICATOR_DOMINANT');
  });

  it('should return ACID_DOMINANT when acid is dominant and no catalyst/indicator precedence', () => {
    expect(classifyRegime(30, 10, 0, 0)).toBe('ACID_DOMINANT');
  });
});
