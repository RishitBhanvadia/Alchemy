const axios = require('axios');

async function testIteration11() {
  try {
    // Test 1: NEUTRAL
    console.log('Testing NEUTRAL regime...');
    const res1 = await axios.post('http://localhost:5000/api/results', {
      chem_a: 45, chem_b: 45, chem_i: 10, chem_c: 0
    });
    console.log('Result 1:', JSON.stringify(res1.data, null, 2));

    // Test 2: ACID_DOMINANT
    console.log('\nTesting ACID_DOMINANT regime...');
    const res2 = await axios.post('http://localhost:5000/api/results', {
      chem_a: 70, chem_b: 20, chem_i: 10, chem_c: 0
    });
    console.log('Result 2:', JSON.stringify(res2.data, null, 2));

    // Test 3: BASE_DOMINANT
    console.log('\nTesting BASE_DOMINANT regime...');
    const res3 = await axios.post('http://localhost:5000/api/results', {
      chem_a: 20, chem_b: 70, chem_i: 10, chem_c: 0
    });
    console.log('Result 3:', JSON.stringify(res3.data, null, 2));

    const success1 = res1.data.reaction_id === 111 && res1.data.regime === 'NEUTRAL' && res1.data.color === 'Grey-Green';
    const success2 = res2.data.reaction_id === 111 && res2.data.regime === 'ACID_DOMINANT' && res2.data.color === 'Yellow';
    const success3 = res3.data.reaction_id === 111 && res3.data.regime === 'BASE_DOMINANT' && res3.data.color === 'Blue';

    if (success1 && success2 && success3) {
      console.log('\nSUCCESS: Iteration 11 verified.');
    } else {
      console.error('\nFAILURE: Iteration 11 verification failed.');
      if (!success1) console.error('Failed Test 1 (NEUTRAL)');
      if (!success2) console.error('Failed Test 2 (ACID_DOMINANT)');
      if (!success3) console.error('Failed Test 3 (BASE_DOMINANT)');
    }
  } catch (error) {
    console.error('Error during test:', error.response ? error.response.data : error.message);
  }
}

testIteration11();
