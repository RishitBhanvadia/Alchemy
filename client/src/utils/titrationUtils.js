export const TITRATION_DATA = [
  {
    reaction_id: "A",
    points: [8, 8.5, 9, 9.5, 10],
    color: ["#bf006b", "#bb0062", "#b80063", "#b70061", "#b8006a"]
  },
  {
    reaction_id: "B",
    points: [7.65, 7.9, 8.15, 8.4, 8.65, 8.9, 9.15, 9.4, 9.65, 10],
    color: ["#bf0095", "#c2007b", "#c8007d", "#c8008b", "#be0090", "#c80086", "#b90083", "#be007c", "#c00087", "#b10080"]
  }
];

export const calculateAcidPath = (count) => {
  const height = 644 - ((count / 10) * 4.3);
  return `M226.348 655.637V682.121C226.348 690.679 226.535 690.688 292.472 690.688C355.57 690.688 354.8 690.675 354.8 682.121V${height}H226.348Z`;
};

/**
 * Calculates the color based on the current count and the reaction data.
 * It finds the last point where (count / 10) >= point and returns the corresponding color.
 * If no match is found, returns null (or the caller should handle default).
 *
 * @param {number} count - The current titration count (drops).
 * @param {object} data - The reaction data object containing points and colors.
 * @returns {string|null} - The calculated color or null if no threshold met.
 */
export const calculateColor = (count, data) => {
  if (!data || !data.points || !data.color) return null;

  let newColor = null;
  const currentVal = count / 10;

  for (let i = 0; i < data.points.length; i++) {
    if (currentVal >= data.points[i]) {
      newColor = data.color[i];
    } else {
      // Since points are sorted ascending, we can break early if we want,
      // but the original code didn't break.
      // Original logic: "if (val >= point) setColor".
      // So if val=9.2, it sets for 8, 8.5, 9.
      // So 9 wins.
      // If we break here, we save iterations.
      break;
    }
  }
  return newColor;
};
