#!/bin/bash

echo "Checking webapp-ssr deployment status..."
echo ""

# Check if pods are running
echo "Pods:"
echo "Check in Kubernetes dashboard or run:"
echo "kubectl get pods -l app.kubernetes.io/name=webapp-ssr"
echo ""

# Check service
echo "Service:"
echo "kubectl get svc webapp-ssr"
echo ""

# Check ingress
echo "Ingress:"
echo "kubectl get ingress learnbytest-ingress -o yaml | grep -A5 'learnbytesting.ai'"
echo ""

# Test URLs
echo "URLs to test:"
echo "1. https://learnbytesting.ai - Should now show your SSR landing page"
echo "2. https://app.learnbytesting.ai - Your main app (unchanged)"
echo ""

echo "Docker image:"
echo "https://hub.docker.com/r/kasparov112000/learnbytesting-webapp-ssr/tags"