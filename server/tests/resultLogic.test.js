// Mock supabase
jest.mock('../supabaseClient', () => ({}));
jest.mock('../utils/logger', () => ({ info: jest.fn(), error: jest.fn() }));

const { calculateResult } = require('../controllers/resultController');
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.join(__dirname, '../controllers/resultController.js'), 'utf8');

// The normalise match in the new code might not be matching fully if it contains an if statement block that breaks the naive regex
const normaliseMatch = code.match(/function normalise\s*\([^)]+\)\s*\{[\s\S]+?\n\}/s);

if (normaliseMatch) {
  try {
      eval(normaliseMatch[0]);
  } catch(e) {
      console.error(e);
  }

  describe('normalise logic', () => {
    test('does not hallucinate c', () => {
      const result = normalise(34, 34, 34, 0);
      expect(result[3]).toBe(0);
    });
    test('handles 0,0,0,30', () => {
      const result = normalise(0, 0, 0, 30);
      expect(result).toEqual([0, 0, 0, 100]);
    });
    test('handles 30,0,0,0', () => {
      const result = normalise(30, 0, 0, 0);
      expect(result).toEqual([100, 0, 0, 0]);
    });
  });
}
