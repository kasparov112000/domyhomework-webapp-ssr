#!/bin/bash

echo "Complete fix for getting real client IPs with DigitalOcean Load Balancer"
echo "======================================================================="

# Step 1: Ensure externalTrafficPolicy is Local
echo "Step 1: Setting externalTrafficPolicy to Local..."
kubectl patch svc nginx-ingress-ingress-nginx-controller -p '{"spec":{"externalTrafficPolicy":"Local"}}'

# Step 2: Enable proxy protocol on DO Load Balancer
echo ""
echo "Step 2: Enabling proxy protocol on DigitalOcean Load Balancer..."
kubectl annotate svc nginx-ingress-ingress-nginx-controller \
  service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol="true" \
  --overwrite

# Step 3: Configure nginx to accept proxy protocol
echo ""
echo "Step 3: Configuring nginx-ingress to accept proxy protocol..."
kubectl patch configmap nginx-ingress-ingress-nginx-controller --type merge -p '{
  "data": {
    "use-proxy-protocol": "true",
    "real-ip-header": "proxy_protocol",
    "real-ip-recursive": "true"
  }
}'

# Step 4: Restart nginx-ingress
echo ""
echo "Step 4: Restarting nginx-ingress pods..."
kubectl rollout restart deployment nginx-ingress-ingress-nginx-controller

echo ""
echo "Waiting for rollout to complete..."
kubectl rollout status deployment nginx-ingress-ingress-nginx-controller --timeout=180s

echo ""
echo "Configuration complete! The load balancer may take a few minutes to update."
echo ""
echo "To test if real IPs are working, run:"
echo "curl -s https://learnbytesting.ai/api/test-headers | jq '.headers.\"x-real-ip\"'"
echo ""
echo "Note: The first few requests after this change might fail as the"
echo "load balancer updates its configuration. This is normal."