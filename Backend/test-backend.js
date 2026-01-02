const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// Helper function to log test results
function logTest(testName, success, error = null) {
  if (success) {
    console.log(`✅ ${testName}`);
    testResults.passed++;
  } else {
    console.log(`❌ ${testName}: ${error}`);
    testResults.failed++;
    testResults.errors.push({ test: testName, error });
  }
}

// Test server health
async function testServerHealth() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    logTest('Server Health Check', response.status === 200 && response.data.status === 'running');
    return response.data;
  } catch (error) {
    logTest('Server Health Check', false, error.message);
    return null;
  }
}

// Test authentication endpoints
async function testAuth() {
  console.log('\n🔐 Testing Authentication...');
  
  // Test login (assuming admin user exists)
  try {
    const loginData = {
      email: 'admin@school.com',
      password: 'admin123'
    };
    
    const response = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    if (response.data.token) {
      authToken = response.data.token;
      logTest('Admin Login', true);
    } else {
      logTest('Admin Login', false, 'No token received');
    }
  } catch (error) {
    logTest('Admin Login', false, error.response?.data?.message || error.message);
  }

  // Test protected route
  if (authToken) {
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logTest('Get User Profile', response.status === 200);
    } catch (error) {
      logTest('Get User Profile', false, error.response?.data?.message || error.message);
    }
  }
}

// Test contact endpoints
async function testContact() {
  console.log('\n📧 Testing Contact...');
  
  // Test sending contact message
  try {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message'
    };
    
    const response = await axios.post(`${BASE_URL}/api/contact`, contactData);
    logTest('Send Contact Message', response.status === 201 || response.status === 200);
  } catch (error) {
    logTest('Send Contact Message', false, error.response?.data?.message || error.message);
  }

  // Test getting all messages (admin only)
  if (authToken) {
    try {
      const response = await axios.get(`${BASE_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logTest('Get All Contact Messages', response.status === 200);
    } catch (error) {
      logTest('Get All Contact Messages', false, error.response?.data?.message || error.message);
    }
  }
}

// Test news endpoints
async function testNews() {
  console.log('\n📰 Testing News...');
  
  // Test getting all news
  try {
    const response = await axios.get(`${BASE_URL}/api/news`);
    logTest('Get All News', response.status === 200);
  } catch (error) {
    logTest('Get All News', false, error.response?.data?.message || error.message);
  }

  // Test creating news (admin only)
  if (authToken) {
    try {
      const newsData = {
        title: 'Test News',
        content: 'This is test news content',
        author: 'Test Author',
        category: 'general'
      };
      
      const response = await axios.post(`${BASE_URL}/api/news`, newsData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logTest('Create News', response.status === 201 || response.status === 200);
    } catch (error) {
      logTest('Create News', false, error.response?.data?.message || error.message);
    }
  }
}

// Test events endpoints
async function testEvents() {
  console.log('\n📅 Testing Events...');
  
  // Test getting all events
  try {
    const response = await axios.get(`${BASE_URL}/api/events`);
    logTest('Get All Events', response.status === 200);
  } catch (error) {
    logTest('Get All Events', false, error.response?.data?.message || error.message);
  }

  // Test creating event (admin only)
  if (authToken) {
    try {
      const eventData = {
        title: 'Test Event',
        description: 'This is a test event',
        date: new Date().toISOString(),
        location: 'Test Location',
        category: 'academic'
      };
      
      const response = await axios.post(`${BASE_URL}/api/events`, eventData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logTest('Create Event', response.status === 201 || response.status === 200);
    } catch (error) {
      logTest('Create Event', false, error.response?.data?.message || error.message);
    }
  }
}

// Test academics endpoints
async function testAcademics() {
  console.log('\n🎓 Testing Academics...');
  
  // Test getting all academic programs
  try {
    const response = await axios.get(`${BASE_URL}/api/academics`);
    logTest('Get All Academic Programs', response.status === 200);
  } catch (error) {
    logTest('Get All Academic Programs', false, error.response?.data?.message || error.message);
  }

  // Test creating academic program (admin only)
  if (authToken) {
    try {
      const academicData = {
        name: 'Test Program',
        description: 'This is a test academic program',
        department: 'Test Department',
        duration: '4 years',
        level: 'undergraduate'
      };
      
      const response = await axios.post(`${BASE_URL}/api/academics`, academicData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logTest('Create Academic Program', response.status === 201 || response.status === 200);
    } catch (error) {
      logTest('Create Academic Program', false, error.response?.data?.message || error.message);
    }
  }
}

// Test staff endpoints
async function testStaff() {
  console.log('\n👥 Testing Staff...');
  
  // Test getting all staff
  try {
    const response = await axios.get(`${BASE_URL}/api/staff`);
    logTest('Get All Staff', response.status === 200);
  } catch (error) {
    logTest('Get All Staff', false, error.response?.data?.message || error.message);
  }

  // Test creating staff member (admin only)
  if (authToken) {
    try {
      const staffData = {
        name: 'Test Staff',
        position: 'Test Position',
        department: 'Test Department',
        email: 'teststaff@school.com',
        phone: '123-456-7890',
        bio: 'This is a test staff member'
      };
      
      const response = await axios.post(`${BASE_URL}/api/staff`, staffData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logTest('Create Staff Member', response.status === 201 || response.status === 200);
    } catch (error) {
      logTest('Create Staff Member', false, error.response?.data?.message || error.message);
    }
  }
}

// Test policies endpoints
async function testPolicies() {
  console.log('\n📋 Testing Policies...');
  
  // Test getting all policies
  try {
    const response = await axios.get(`${BASE_URL}/api/policies`);
    logTest('Get All Policies', response.status === 200);
  } catch (error) {
    logTest('Get All Policies', false, error.response?.data?.message || error.message);
  }

  // Test creating policy (admin only)
  if (authToken) {
    try {
      const policyData = {
        title: 'Test Policy',
        content: 'This is test policy content',
        category: 'academic',
        effectiveDate: new Date().toISOString()
      };
      
      const response = await axios.post(`${BASE_URL}/api/policies`, policyData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logTest('Create Policy', response.status === 201 || response.status === 200);
    } catch (error) {
      logTest('Create Policy', false, error.response?.data?.message || error.message);
    }
  }
}

// Test about endpoints
async function testAbout() {
  console.log('\n🏫 Testing About...');
  
  // Test getting about information
  try {
    const response = await axios.get(`${BASE_URL}/api/about`);
    logTest('Get About Information', response.status === 200);
  } catch (error) {
    logTest('Get About Information', false, error.response?.data?.message || error.message);
  }
}

// Test error handling
async function testErrorHandling() {
  console.log('\n⚠️ Testing Error Handling...');
  
  // Test 404 route
  try {
    await axios.get(`${BASE_URL}/api/nonexistent`);
    logTest('404 Error Handling', false, 'Should have returned 404');
  } catch (error) {
    logTest('404 Error Handling', error.response?.status === 404);
  }

  // Test invalid data
  try {
    await axios.post(`${BASE_URL}/api/contact`, {});
    logTest('Validation Error Handling', false, 'Should have returned validation error');
  } catch (error) {
    logTest('Validation Error Handling', error.response?.status === 400);
  }
}

// Main test runner
async function runAllTests() {
  console.log('🧪 Starting Backend API Tests...\n');
  
  const serverInfo = await testServerHealth();
  if (!serverInfo) {
    console.log('❌ Server is not running. Please start the server first.');
    return;
  }

  console.log(`📊 Database Status: ${serverInfo.database}`);
  console.log(`🔗 Available Endpoints: ${Object.keys(serverInfo.endpoints).length}`);

  await testAuth();
  await testContact();
  await testNews();
  await testEvents();
  await testAcademics();
  await testStaff();
  await testPolicies();
  await testAbout();
  await testErrorHandling();

  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  if (testResults.errors.length > 0) {
    console.log('\n🔍 Failed Tests:');
    testResults.errors.forEach(error => {
      console.log(`   • ${error.test}: ${error.error}`);
    });
  }

  // Save results to file
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      passed: testResults.passed,
      failed: testResults.failed,
      successRate: ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1) + '%'
    },
    errors: testResults.errors,
    serverInfo
  };

  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Test report saved to test-report.json');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };