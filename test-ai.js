// Test script to check AI status
// Usage: TEST_USER=admin TEST_PASS=admin123 node test-ai.js
const axios = require('axios');

const TEST_USER = process.env.TEST_USER || 'admin';
const TEST_PASS = process.env.TEST_PASS || 'admin123';

async function testAIStatus() {
  try {
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      user: TEST_USER,
      pass: TEST_PASS
    });

    const token = loginResponse.data.access_token;
    console.log('Token obtained:', token.substring(0, 20) + '...');

    const aiStatusResponse = await axios.get('http://localhost:3000/api/ai/status', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('AI Status:', JSON.stringify(aiStatusResponse.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAIStatus();
