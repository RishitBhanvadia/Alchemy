const fs = require('fs');
const path = require('path');

// Extract the unexported 'normalise' function to unit test it safely
// Memory note: "To unit test unexported functions within Alchemistry server controllers without triggering top-level initialization crashes... extract the function as a string using fs.readFileSync and evaluate it with new Function() inside the test suite."
const controllerPath = path.join(__dirname, '../controllers/resultController.js');
const sourceCode = fs.readFileSync(controllerPath, 'utf8');

// Using regex to find the `normalise` function body
const match = sourceCode.match(/function normalise\(a, b, i, c\) {([\s\S]*?)\n}/);
if (!match) throw new Error("Could not find normalise function in resultController.js");

const normaliseFuncBody = match[1];
const normalise = new Function('a', 'b', 'i', 'c', normaliseFuncBody);

describe('Result Controller Logic', () => {
  describe('normalise function', () => {
    it('should correctly normalise percentages without hallucinating values', () => {
      // Bug reproduction: 33.3 + 33.3 + 33.3 + 0
      // Previous code would result in 33, 33, 33, 1
      const result = normalise(33.3, 33.3, 33.3, 0);

      // Expected result: 34, 33, 33, 0 (order of which gets the +1 may vary depending on max value, but 'c' MUST be 0)
      expect(result).toEqual([34, 33, 33, 0]);
    });

    it('should normalise standard values accurately', () => {
        const result = normalise(50, 25, 25, 0);
        expect(result).toEqual([50, 25, 25, 0]);
    });

    it('should assign all to the single chemical if only one is present', () => {
        const result = normalise(0, 0, 0, 100);
        expect(result).toEqual([0, 0, 0, 100]);
    });
  });
});
