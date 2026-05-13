const fs = require('fs');
const path = require('path');

// Read the controller file
const controllerCode = fs.readFileSync(path.join(__dirname, '../controllers/resultController.js'), 'utf8');

// Extract the normalise function as a string
const normaliseMatch = controllerCode.match(/function normalise\(a, b, i, c\) \{[\s\S]*?\n\}/);
if (!normaliseMatch) {
  throw new Error("Could not find normalise function in resultController.js");
}

const normaliseFnString = normaliseMatch[0];

// Evaluate the function string into an executable function
const normalise = new Function(`return ${normaliseFnString}`)();

describe('normalise function logic', () => {
  it('should correctly normalise and handle rounding remainder without hallucinating values', () => {
    // Current bug: 33/33/33/0 -> na=33, nb=33, ni=33. nc = 100 - 33 - 33 - 33 = 1.
    // So nc becomes 1 instead of 0.
    const result = normalise(33, 33, 33, 0);
    expect(result).toEqual([34, 33, 33, 0]); // Should give remainder to largest value, preserving zeroes.
  });
});
