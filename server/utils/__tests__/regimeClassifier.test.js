const { classifyRegime } = require('../regimeClassifier');

describe('classifyRegime', () => {
  it('correctly classifies CATALYST_DOMINANT when A+B is minimal', () => {
    // A=5, B=0, I=0, C=30 -> acidBaseSum = 5 < 20, C = 30 > 20
    const result = classifyRegime(5, 0, 0, 30);
    expect(result).toBe('CATALYST_DOMINANT');
  });

  it('correctly classifies INDICATOR_DOMINANT when A+B is minimal', () => {
    // A=10, B=0, I=40, C=0 -> acidBaseSum = 10 < 20, I = 40 > 30, C = 0 < 20
    const result = classifyRegime(10, 0, 40, 0);
    expect(result).toBe('INDICATOR_DOMINANT');
  });

  it('correctly classifies ACID_DOMINANT', () => {
    const result = classifyRegime(70, 20);
    expect(result).toBe('ACID_DOMINANT');
  });

  it('correctly classifies BASE_DOMINANT', () => {
    const result = classifyRegime(20, 70);
    expect(result).toBe('BASE_DOMINANT');
  });

  it('correctly classifies NEUTRAL', () => {
    const result = classifyRegime(50, 50);
    expect(result).toBe('NEUTRAL');
  });
});
