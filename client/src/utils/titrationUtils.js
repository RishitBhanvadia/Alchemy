export const TITRATION_DATA = [
  {
    "reaction_id": "A",
    "points": [8, 8.5, 9, 9.5, 10],
    "color": ["#bf006b", "#bb0062", "#b80063", "#b70061", "#b8006a"]
  },
  {
    "reaction_id": "B",
    "points": [7.65, 7.9, 8.15, 8.4, 8.65, 8.9, 9.15, 9.4, 9.65, 10],
    "color": ["#bf0095", "#c2007b", "#c8007d", "#c8008b", "#be0090", "#c80086", "#b90083", "#be007c", "#c00087", "#b10080"]
  }
];

export const calculateScore = (finalCount) => {
  // Calibrate score: 100 is target.
  // Score = 100 - difference. Min 0.
  const diff = Math.abs(100 - finalCount);
  let score = 100 - diff;
  if (score < 0) score = 0;
  return score;
};

export const getFeedbackMessage = (score) => {
  if (score === 100) return "Perfect Titration!";
  else if (score >= 90) return "Great job! Very close.";
  else if (score >= 70) return "Good attempt. Watch the color change closely.";
  return "Overshot or Undershot. Try again!";
};

export const generateAcidPath = (count) => {
  const height = 644 - ((count / 10) * 4.3);
  return `M226.348 655.637V682.121C226.348 690.679 226.535 690.688 292.472 690.688C355.57 690.688 354.8 690.675 354.8 682.121V${height}H226.348Z`;
};
