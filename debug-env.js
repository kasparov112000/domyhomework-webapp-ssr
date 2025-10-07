#!/usr/bin/env node
require('dotenv').config();

console.log('Current Environment Variables:');
console.log('==============================');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('ENV_NAME:', process.env.ENV_NAME);
console.log('ENABLE_VISITOR_LOGGING:', process.env.ENABLE_VISITOR_LOGGING);
console.log('SEND_TO_AUDIT_API:', process.env.SEND_TO_AUDIT_API);
console.log('LOCAL_ORCHESTRATOR_PORT:', process.env.LOCAL_ORCHESTRATOR_PORT);
console.log('ORCHESTRATOR_URL:', process.env.ORCHESTRATOR_URL);
console.log('AUDIT_API_KEY:', process.env.AUDIT_API_KEY ? 'Set' : 'Not set');
console.log('');

// Test the logic
const isLocal = process.env.NODE_ENV === 'development' || 
                process.env.ENV_NAME === 'LOCAL' || 
                !process.env.NODE_ENV;

console.log('Detected Environment:', isLocal ? 'LOCAL' : 'PRODUCTION');

const orchestratorUrl = process.env.ORCHESTRATOR_URL || 
                       (isLocal ? `http://localhost:${process.env.LOCAL_ORCHESTRATOR_PORT || '8080'}` 
                                : 'https://orchestrator.learnbytesting.ai');

console.log('Orchestrator URL:', orchestratorUrl);
console.log('');

// Check specific conditions
console.log('Checks:');
console.log('- Visitor logging enabled?', process.env.ENABLE_VISITOR_LOGGING !== 'false');
console.log('- Send to API enabled?', process.env.SEND_TO_AUDIT_API !== 'false');
console.log('- SEND_TO_AUDIT_API === "false"?', process.env.SEND_TO_AUDIT_API === 'false');
console.log('- SEND_TO_AUDIT_API value:', JSON.stringify(process.env.SEND_TO_AUDIT_API));