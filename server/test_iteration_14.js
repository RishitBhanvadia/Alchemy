const axios = require('axios');

const testIteration14 = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/results', {
      chem_b: 55,
      chem_i: 25,
      chem_c: 20
    });

    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

    const { outcome_label, color, state_change, is_dangerous } = response.data;

    const success = 
      outcome_label === "Alkaline Manganese Complex — Indicator Bleached" &&
      color === "Blue fading to Brown" &&
      state_change.includes("Precipitate") &&
      is_dangerous === true;

    if (success) {
      console.log('✅ Iteration 14 Passed!');
    } else {
      console.log('❌ Iteration 14 Failed!');
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

testIteration14();
