const axios = require('axios');

async function test() {
  try {
    const response = await axios.post('http://localhost:5000/api/results', {
      chem_a: 100,
      chem_b: 0,
      chem_i: 0,
      chem_c: 0
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

test();
