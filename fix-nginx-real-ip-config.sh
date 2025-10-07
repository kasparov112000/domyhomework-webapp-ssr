#!/bin/bash

echo "Updating nginx-ingress ConfigMap to use standard X-Forwarded-For header..."

# Update the ConfigMap to use X-Forwarded-For instead of CF-Connecting-IP
kubectl patch configmap nginx-ingress-ingress-nginx-controller --type merge -p '{"data":{"real-ip-header":"X-Forwarded-For","real-ip-recursive":"true"}}'

echo "ConfigMap patched. Restarting nginx-ingress pods..."
kubectl rollout restart deployment nginx-ingress-ingress-nginx-controller

echo "Waiting for rollout to complete..."
kubectl rollout status deployment nginx-ingress-ingress-nginx-controller --timeout=120s

echo "Checking the updated configuration..."
kubectl get configmap nginx-ingress-ingress-nginx-controller -o jsonpath='{.data.real-ip-header}'
echo ""

echo "Waiting 10 seconds for changes to take effect..."
sleep 10

echo "Testing headers endpoint..."
curl -s https://learnbytesting.ai/api/test-headers | jq '.headers."x-real-ip", .headers."x-forwarded-for", .connection.ip' 2>/dev/null || echo "Failed to get headers"