const { _normalise } = require('../controllers/resultController');

describe('resultController logic', () => {
  it('should compute normalise correctly', () => {
    // Test case 1: chem C gets 0% when C is 0, difference goes to largest
    expect(_normalise(33.3, 33.3, 33.3, 0)).toEqual([34, 33, 33, 0]);

    // Test case 2: Total < 100 without remainder
    expect(_normalise(25, 25, 25, 25)).toEqual([25, 25, 25, 25]);

    // Test case 3: Exact 0s
    expect(_normalise(0, 0, 0, 100)).toEqual([0, 0, 0, 100]);
  });
});
