const validateConcentration = (val) => {
  if (val === undefined || val === null || val === '') return true;
  const n = Number(val);
  return !isNaN(n) && n >= 0 && n <= 100;
};

module.exports = { validateConcentration };
