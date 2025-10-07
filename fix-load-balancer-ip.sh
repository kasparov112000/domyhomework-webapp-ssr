#!/bin/bash

echo "Fixing Load Balancer to preserve real client IPs..."

# Patch the nginx-ingress service to use Local externalTrafficPolicy
# This preserves the real client IP but may cause uneven load distribution
kubectl patch svc nginx-ingress-ingress-nginx-controller -p '{"spec":{"externalTrafficPolicy":"Local"}}' --type merge

echo ""
echo "Waiting for changes to propagate..."
sleep 10

# Verify the change
echo ""
echo "Verifying the change:"
kubectl get svc nginx-ingress-ingress-nginx-controller -o jsonpath='{.spec.externalTrafficPolicy}'
echo ""

# Check if proxy protocol should be enabled (DigitalOcean specific)
echo ""
echo "Current proxy protocol setting:"
kubectl get svc nginx-ingress-ingress-nginx-controller -o jsonpath='{.metadata.annotations.service\.beta\.kubernetes\.io/do-loadbalancer-enable-proxy-protocol}'
echo ""

# Instructions
echo ""
echo "==============================================="
echo "Load Balancer configuration updated!"
echo ""
echo "Note: With externalTrafficPolicy: Local"
echo "- Real client IPs will be preserved"
echo "- Traffic will only go to nodes running nginx pods"
echo "- This may cause uneven load distribution"
echo ""
echo "If you're using DigitalOcean and still seeing internal IPs,"
echo "you may need to enable proxy protocol:"
echo ""
echo "kubectl annotate svc nginx-ingress-ingress-nginx-controller \\"
echo "  service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol=\"true\" \\"
echo "  --overwrite"
echo ""
echo "Test the changes with:"
echo "curl -s https://learnbytesting.ai/api/test-headers | grep -E 'x-forwarded-for|x-real-ip'"
echo "==============================================="