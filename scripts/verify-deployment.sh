#!/bin/bash

echo "=== Verifying webapp-ssr deployment ==="
echo ""

# Check HTTP status
echo "1. Checking HTTP status of learnbytesting.ai..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://learnbytesting.ai)
echo "   HTTP Status: $STATUS"
echo ""

# Check for Angular app
echo "2. Checking page content..."
CONTENT=$(curl -s https://learnbytesting.ai | head -100)
if echo "$CONTENT" | grep -q "app-root"; then
    echo "   ✓ Found Angular app-root component"
else
    echo "   ✗ Angular app-root not found"
fi

if echo "$CONTENT" | grep -q "LearnByTesting"; then
    echo "   ✓ Found LearnByTesting content"
else
    echo "   ✗ LearnByTesting content not found"
fi

if echo "$CONTENT" | grep -q "WordPress"; then
    echo "   ⚠ Still serving WordPress content"
else
    echo "   ✓ Not serving WordPress"
fi
echo ""

# Check other endpoints
echo "3. Checking other routes..."
for route in "/features" "/about" "/pricing" "/contact"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://learnbytesting.ai$route)
    echo "   https://learnbytesting.ai$route - Status: $STATUS"
done
echo ""

# Check app subdomain
echo "4. Verifying app.learnbytesting.ai still works..."
APP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://app.learnbytesting.ai)
echo "   https://app.learnbytesting.ai - Status: $APP_STATUS"
echo ""

echo "5. Recent deployments:"
echo "   Check: https://github.com/kasparov112000/learnbytesting-webapp-ssr/actions"
echo ""

echo "6. Docker image:"
echo "   https://hub.docker.com/r/kasparov112000/learnbytesting-webapp-ssr/tags"
echo ""

echo "If the site is still showing WordPress:"
echo "1. The ingress may need to be reapplied"
echo "2. DNS may be cached (try incognito mode)"
echo "3. Check pod logs: kubectl logs -l app.kubernetes.io/name=webapp-ssr"