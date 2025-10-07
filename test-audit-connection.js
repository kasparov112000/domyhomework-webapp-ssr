#!/usr/bin/env node
const axios = require('axios');
require('dotenv').config();

async function testAuditConnection() {
  console.log('Testing Audit Log Connection...\n');
  
  // Determine URL based on environment
  const isLocal = process.env.NODE_ENV === 'development' || 
                  process.env.ENV_NAME === 'LOCAL' || 
                  !process.env.NODE_ENV;
  
  const orchestratorUrl = process.env.ORCHESTRATOR_URL || 
                         (isLocal ? `http://localhost:${process.env.LOCAL_ORCHESTRATOR_PORT || '8080'}` 
                                  : 'https://orchestrator.learnbytesting.ai');
  
  console.log(`Environment: ${isLocal ? 'LOCAL' : 'PRODUCTION'}`);
  console.log(`Orchestrator URL: ${orchestratorUrl}`);
  console.log(`API Key: ${process.env.AUDIT_API_KEY ? 'Set' : 'Not Set'}\n`);
  
  // Test GET endpoint
  console.log('1. Testing GET /api/auditLogs...');
  try {
    const getResponse = await axios.get(`${orchestratorUrl}/api/auditLogs`, {
      params: { entityName: 'visitor-logs', $limit: 1 },
      headers: {
        'X-API-Key': process.env.AUDIT_API_KEY || ''
      },
      timeout: 5000
    });
    console.log('✅ GET request successful');
    console.log(`   Found ${getResponse.data.length || 0} visitor logs\n`);
  } catch (error) {
    console.log('❌ GET request failed');
    console.log(`   Error: ${error.response?.status} ${error.response?.statusText || error.message}\n`);
  }
  
  // Test POST endpoint
  console.log('2. Testing POST /api/auditLogs...');
  const testEntry = {
    entityName: 'visitor-logs',
    entityType: 'test-connection',
    details: 'Test audit log connection from SSR app',
    dateTime: new Date(),
    data: {
      test: true,
      source: 'webapp-ssr',
      timestamp: new Date().toISOString()
    }
  };
  
  try {
    const postResponse = await axios.post(
      `${orchestratorUrl}/api/auditLogs`,
      testEntry,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.AUDIT_API_KEY || ''
        },
        timeout: 5000
      }
    );
    console.log('✅ POST request successful');
    console.log(`   Response: ${postResponse.status} ${postResponse.statusText}`);
    if (postResponse.data?._id) {
      console.log(`   Created log ID: ${postResponse.data._id}`);
    }
  } catch (error) {
    console.log('❌ POST request failed');
    if (error.response) {
      console.log(`   Status: ${error.response.status} ${error.response.statusText}`);
      if (error.response.data) {
        const data = typeof error.response.data === 'string' 
          ? error.response.data.substring(0, 200) 
          : JSON.stringify(error.response.data);
        console.log(`   Response: ${data}`);
      }
    } else {
      console.log(`   Error: ${error.message}`);
    }
  }
  
  console.log('\n---\n');
  console.log('Summary:');
  if (isLocal) {
    console.log('- Make sure the orchestrator is running on port 8080');
    console.log('- Run: cd /mnt/c/Users/Renato/repos/lbt/orchestrator && npm start');
  } else {
    console.log('- Make sure AUDIT_API_KEY is set for production access');
  }
}

testAuditConnection().catch(console.error);