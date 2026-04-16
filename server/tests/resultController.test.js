const { normalise } = require('../controllers/resultController');

describe('resultController normalise', () => {
    it('should not hallucinate non-zero value for 0 input', () => {
        // e.g. a=33, b=33, i=33, c=0
        const result = normalise(33, 33, 33, 0);
        // Expect that the 4th element (c) remains 0
        expect(result[3]).toBe(0);
    });

    it('should handle string inputs correctly when resolving rounding differences', () => {
        // e.g. a="33", b="33", i="33", c="0"
        const result = normalise("33", "33", "33", "0");
        // Ensure max value lookup works with string inputs
        expect(result[3]).toBe(0);
        expect(result[0]).toBe(34); // The first max value should get the extra 1
    });
});
