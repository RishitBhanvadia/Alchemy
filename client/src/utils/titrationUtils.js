import { ACID_PATH_TEMPLATE } from './titrationConstants';

/**
 * Calculates the SVG path for the acid based on the current count (volume).
 * @param {number} count - The current count representing volume (1 count = 0.1ml approx).
 * @returns {string} The SVG path string.
 */
export const calculateAcidPath = (count) => {
    // Formula derived from original code: 644 - ((count / 10) * 4.3)
    // 210 and 21 were also magic numbers in the base_box logic, but we focus on acid path here.
    const volumeFactor = (count / 10) * 4.3;
    const height = 644 - volumeFactor;
    return `${ACID_PATH_TEMPLATE.BASE}${height}${ACID_PATH_TEMPLATE.SUFFIX}`;
};

/**
 * Determines the color of the solution based on the volume and reaction data.
 * @param {number} count - The current count.
 * @param {object} data - The reaction data object containing points and colors.
 * @returns {string|null} The hex color code or null if no threshold is met.
 */
export const calculateColor = (count, data) => {
    const volume = count / 10;

    // Original logic: Finds the FIRST point where volume >= point.
    // Note: Since points are ascending, this always returns the color of the first threshold passed
    // and ignores subsequent thresholds. This replicates existing behavior.
    const matchIndex = data.points.findIndex(point => volume >= point);

    if (matchIndex !== -1) {
        return data.color[matchIndex];
    }
    return null;
};

/**
 * Calculates the score based on the final volume count.
 * @param {number} count - The final count.
 * @returns {number} The calculated score (0-100).
 */
export const calculateScore = (count) => {
    const diff = Math.abs(100 - count);
    let score = 100 - diff;
    return score < 0 ? 0 : score;
};

/**
 * Generates feedback message based on score.
 * @param {number} score - The score (0-100).
 * @returns {string} Feedback message.
 */
export const getFeedbackMessage = (score) => {
    if (score === 100) return "Perfect Titration!";
    if (score >= 90) return "Great job! Very close.";
    if (score >= 70) return "Good attempt. Watch the color change closely.";
    return "Overshot or Undershot. Try again!";
};
