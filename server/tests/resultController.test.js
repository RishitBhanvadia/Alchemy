const { normalise } = require('../controllers/resultController');

describe('resultController normalise logic', () => {
  it('should normalise 4 equal values to 25 each', () => {
    expect(normalise(1, 1, 1, 1)).toEqual([25, 25, 25, 25]);
  });

  it('should normalise 33.33/33.33/33.33/0 without attributing to zero-concentration c', () => {
    // The previous implementation would assign 100 - 33 - 33 - 33 = 1 to chem_c.
    // It should distribute the rounding error to the highest concentration.
    const result = normalise(33.33, 33.33, 33.33, 0);
    expect(result[3]).toBe(0); // chem_c must remain 0

    const sum = result.reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });

  it('should normalise 34, 33, 33 correctly', () => {
    const result = normalise(34, 33, 33, 0);
    expect(result[3]).toBe(0);
    const sum = result.reduce((a, b) => a + b, 0);
    expect(sum).toBe(100);
  });
});
