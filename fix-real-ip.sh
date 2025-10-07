#!/bin/bash

echo "Fixing nginx-ingress to preserve real client IPs..."

# Patch the service to use externalTrafficPolicy: Local
kubectl patch svc nginx-ingress-ingress-nginx-controller -p '{"spec":{"externalTrafficPolicy":"Local"}}'

echo "Service patched. Checking the configuration..."
kubectl get svc nginx-ingress-ingress-nginx-controller -o jsonpath='{.spec.externalTrafficPolicy}'
echo ""

echo "Waiting for changes to propagate..."
sleep 5

echo "Testing the headers endpoint..."
curl -s https://learnbytesting.ai/api/test-headers | jq '.headers."x-real-ip", .headers."x-forwarded-for"' 2>/dev/null || echo "Failed to get headers"

echo ""
echo "Note: With externalTrafficPolicy: Local, traffic will only be routed to nodes"
echo "where nginx-ingress pods are running. This might cause some requests to fail"
echo "if pods are not evenly distributed across nodes."