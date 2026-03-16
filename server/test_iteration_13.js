const axios = require('axios');

const testIteration13 = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/results', {
      chem_a: 55,
      chem_i: 25,
      chem_c: 20
    });

    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    const { outcome_label, state_change, is_dangerous } = response.data;

    const success = 
      outcome_label === "Catalytic Acid Oxidation — Indicator Bleached" &&
      state_change.includes("Gas") &&
      state_change.includes("Bleaching") &&
      is_dangerous === true;

    if (success) {
      console.log('✅ Iteration 13 Passed!');
    } else {
      console.log('❌ Iteration 13 Failed!');
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testIteration13();
