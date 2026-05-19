// Test script to check AI chat functionality
// Usage: TEST_USER=admin TEST_PASS=admin123 node test-ai-chat.js
const axios = require('axios');

const TEST_USER = process.env.TEST_USER || 'admin';
const TEST_PASS = process.env.TEST_PASS || 'admin123';

async function testAIChat() {
  try {
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      user: TEST_USER,
      pass: TEST_PASS
    });

    const token = loginResponse.data.access_token;
    console.log('Token obtained');

    const aiResponse = await axios.post('http://localhost:3000/api/ai/chat', {
      message: 'Hola, ¿cómo estás?'
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('AI Response:', aiResponse.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAIChat();
