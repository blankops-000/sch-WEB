const { spawn } = require('child_process');
const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';
let serverProcess = null;

// Test results
const results = { passed: 0, failed: 0, errors: [] };

function log(test, success, error = null) {
  if (success) {
    console.log(`✅ ${test}`);
    results.passed++;
  } else {
    console.log(`❌ ${test}: ${error}`);
    results.failed++;
    results.errors.push({ test, error });
  }
}

// Start server
function startServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Starting server...');
    serverProcess = spawn('node', ['sever.js'], { cwd: __dirname });
    
    let output = '';
    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      if (output.includes('Server running on port')) {
        console.log('✅ Server started successfully');
        setTimeout(resolve, 1000); // Wait 1 second for full startup
      }
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
      reject(new Error(data.toString()));
    });
    
    setTimeout(() => reject(new Error('Server startup timeout')), 10000);
  });
}

// Stop server
function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    console.log('🛑 Server stopped');
  }
}

// Basic tests
async function runTests() {
  try {
    // Test 1: Server health
    const health = await axios.get(`${BASE_URL}/`);
    log('Server Health', health.status === 200 && health.data.status === 'running');
    
    // Test 2: Get news (public endpoint)
    try {
      const news = await axios.get(`${BASE_URL}/api/news`);
      log('Get News Endpoint', news.status === 200);
    } catch (error) {
      log('Get News Endpoint', false, error.response?.status || error.message);
    }
    
    // Test 3: Get events (public endpoint)
    try {
      const events = await axios.get(`${BASE_URL}/api/events`);
      log('Get Events Endpoint', events.status === 200);
    } catch (error) {
      log('Get Events Endpoint', false, error.response?.status || error.message);
    }
    
    // Test 4: Get staff (public endpoint)
    try {
      const staff = await axios.get(`${BASE_URL}/api/staff`);
      log('Get Staff Endpoint', staff.status === 200);
    } catch (error) {
      log('Get Staff Endpoint', false, error.response?.status || error.message);
    }
    
    // Test 5: Contact form (public endpoint)
    try {
      const contact = await axios.post(`${BASE_URL}/api/contact`, {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'general',
        message: 'Test message'
      });
      log('Contact Form Submission', contact.status === 200 || contact.status === 201);
    } catch (error) {
      log('Contact Form Submission', false, error.response?.data?.message || error.message);
    }
    
    // Test 6: 404 handling
    try {
      await axios.get(`${BASE_URL}/api/nonexistent`);
      log('404 Error Handling', false, 'Should return 404');
    } catch (error) {
      log('404 Error Handling', error.response?.status === 404);
    }
    
    // Test 7: Invalid contact data
    try {
      await axios.post(`${BASE_URL}/api/contact`, {});
      log('Validation Error Handling', false, 'Should return validation error');
    } catch (error) {
      log('Validation Error Handling', error.response?.status === 400);
    }
    
  } catch (error) {
    console.error('Test execution error:', error.message);
  }
}

// Main execution
async function main() {
  console.log('🧪 Backend API Quick Test\n');
  
  try {
    await startServer();
    await runTests();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    stopServer();
    
    // Results
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    
    if (results.errors.length > 0) {
      console.log('\n🔍 Failed Tests:');
      results.errors.forEach(error => {
        console.log(`   • ${error.test}: ${error.error}`);
      });
    }
  }
}

main().catch(console.error);