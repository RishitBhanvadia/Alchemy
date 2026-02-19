import { describe, it, expect } from 'vitest';
import { calculateAcidPath, calculateColor, TITRATION_DATA } from '../titrationUtils';

describe('calculateAcidPath', () => {
  it('should calculate the correct SVG path for count 0', () => {
    const expectedHeight = 644;
    const expectedPath = `M226.348 655.637V682.121C226.348 690.679 226.535 690.688 292.472 690.688C355.57 690.688 354.8 690.675 354.8 682.121V${expectedHeight}H226.348Z`;
    expect(calculateAcidPath(0)).toBe(expectedPath);
  });

  it('should calculate the correct SVG path for count 10', () => {
    const expectedHeight = 644 - (1 * 4.3);
    const expectedPath = `M226.348 655.637V682.121C226.348 690.679 226.535 690.688 292.472 690.688C355.57 690.688 354.8 690.675 354.8 682.121V${expectedHeight}H226.348Z`;
    expect(calculateAcidPath(10)).toBe(expectedPath);
  });
});

describe('calculateColor', () => {
  const data = TITRATION_DATA[0];

  it('should return null if count is below first threshold', () => {
    // first point is 8 -> count/10 >= 8 -> count >= 80
    // so count 79 is below
    expect(calculateColor(79, data)).toBeNull();
  });

  it('should return the first color if count matches first threshold', () => {
    // count 80 -> 8.0 >= 8
    expect(calculateColor(80, data)).toBe(data.color[0]);
  });

  it('should return the last color if count is above last threshold', () => {
    // last point is 10 -> count 100
    expect(calculateColor(100, data)).toBe(data.color[data.color.length - 1]);
  });

  it('should handle undefined data gracefully', () => {
    expect(calculateColor(50, null)).toBeNull();
    expect(calculateColor(50, {})).toBeNull();
  });
});
