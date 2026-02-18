import { describe, it, expect } from 'vitest';
import { calculateScore, getFeedbackMessage, generateAcidPath } from '../titrationUtils';

describe('titrationUtils', () => {
  describe('calculateScore', () => {
    it('should return 100 for exact count', () => {
      expect(calculateScore(100)).toBe(100);
    });

    it('should return correct score for undershot', () => {
      expect(calculateScore(90)).toBe(90); // 100 - |100 - 90| = 90
    });

    it('should return correct score for overshot', () => {
      expect(calculateScore(110)).toBe(90); // 100 - |100 - 110| = 90
    });

    it('should return 0 for large differences', () => {
      expect(calculateScore(0)).toBe(0);
      expect(calculateScore(200)).toBe(0);
    });
  });

  describe('getFeedbackMessage', () => {
    it('should return perfect message for 100', () => {
      expect(getFeedbackMessage(100)).toBe("Perfect Titration!");
    });

    it('should return great job for 90-99', () => {
      expect(getFeedbackMessage(95)).toBe("Great job! Very close.");
      expect(getFeedbackMessage(90)).toBe("Great job! Very close.");
    });

    it('should return good attempt for 70-89', () => {
      expect(getFeedbackMessage(80)).toBe("Good attempt. Watch the color change closely.");
      expect(getFeedbackMessage(70)).toBe("Good attempt. Watch the color change closely.");
    });

    it('should return try again for < 70', () => {
      expect(getFeedbackMessage(69)).toBe("Overshot or Undershot. Try again!");
      expect(getFeedbackMessage(0)).toBe("Overshot or Undershot. Try again!");
    });
  });

  describe('generateAcidPath', () => {
    it('should generate correct path string', () => {
      const path = generateAcidPath(0);
      expect(path).toContain('V644H226.348Z'); // 644 - 0 = 644
    });

    it('should calculate height correctly', () => {
        // count = 100 -> (100/10)*4.3 = 43. 644 - 43 = 601
        const path = generateAcidPath(100);
        expect(path).toContain('V601H226.348Z');
    });
  });
});
