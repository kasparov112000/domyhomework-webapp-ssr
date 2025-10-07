#!/bin/bash

echo "========================================="
echo "Testing Visitor Logging System"
echo "========================================="
echo ""

# Check if logs directory exists
if [ ! -d "logs" ]; then
  echo "Creating logs directory..."
  mkdir logs
fi

echo "Current environment variables:"
echo "- NODE_ENV: ${NODE_ENV:-not set}"
echo "- ENV_NAME: ${ENV_NAME:-not set}"
echo "- ENABLE_VISITOR_LOGGING: ${ENABLE_VISITOR_LOGGING:-not set}"
echo "- SEND_TO_AUDIT_API: ${SEND_TO_AUDIT_API:-not set}"
echo "- LOCAL_ORCHESTRATOR_PORT: ${LOCAL_ORCHESTRATOR_PORT:-not set}"
echo ""

echo "Starting visitor logging test..."
echo ""

# Make a test request using curl
echo "1. Testing /test-visitor-log endpoint..."
curl -s http://localhost:4000/test-visitor-log | jq . || echo "Server not running?"

echo ""
echo "2. Testing home page..."
curl -s http://localhost:4000/ -o /dev/null -w "Status: %{http_code}\n"

echo ""
echo "3. Waiting 6 seconds for batch processing..."
sleep 6

echo ""
echo "4. Checking local log files..."
if [ -f "logs/visitor-log-$(date +%Y-%m-%d).json" ]; then
  echo "✅ Log file exists"
  echo "Recent entries:"
  tail -n 5 "logs/visitor-log-$(date +%Y-%m-%d).json" | jq .
else
  echo "❌ No log file found"
fi

echo ""
echo "5. Checking orchestrator connection..."
curl -s http://localhost:8080/api/auditLogs?entityName=visitor-logs\&\$limit=5 | jq . || echo "Orchestrator not running on port 8080?"

echo ""
echo "========================================="
echo "Test complete!"
echo "========================================="