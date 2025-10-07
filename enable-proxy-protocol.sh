#!/bin/bash

echo "Enabling proxy protocol on DigitalOcean Load Balancer..."

# Enable proxy protocol on the DO Load Balancer
kubectl annotate svc nginx-ingress-ingress-nginx-controller \
  service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol="true" \
  --overwrite

echo "Updating nginx-ingress to accept proxy protocol..."

# We need to update the nginx-ingress ConfigMap to enable proxy protocol
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-ingress-ingress-nginx-controller
  namespace: default
data:
  use-proxy-protocol: "true"
  real-ip-header: "proxy_protocol"
  proxy-protocol-header-timeout: "5s"
EOF

echo "Restarting nginx-ingress pods to apply changes..."
kubectl rollout restart deployment nginx-ingress-ingress-nginx-controller

echo "Waiting for rollout to complete..."
kubectl rollout status deployment nginx-ingress-ingress-nginx-controller

echo "Configuration updated. Testing in 30 seconds..."
sleep 30

echo "Testing headers endpoint..."
curl -s https://learnbytesting.ai/api/test-headers | jq '.headers."x-real-ip", .headers."x-forwarded-for"' 2>/dev/null || echo "Failed to get headers"