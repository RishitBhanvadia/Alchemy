const axios = require('axios');

async function test(chem_a, chem_b, chem_i, chem_c, label) {
  console.log(`\n--- Testing ${label} ---`);
  try {
    const response = await axios.post('http://localhost:5000/api/results', {
      chem_a,
      chem_b,
      chem_i,
      chem_c
    });
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('Error Response:', error.response.data);
    } else {
      console.error('Error Message:', error.message);
    }
  }
}

async function runTests() {
  // Iteration 12: Reaction ID 1011
  await test(45, 45, 0, 10, 'NEUTRAL (1011)');
  await test(70, 20, 0, 10, 'ACID_DOMINANT (1011)');
  await test(20, 70, 0, 10, 'BASE_DOMINANT (1011)');
}

runTests();
