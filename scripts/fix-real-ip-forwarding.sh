#!/bin/bash

echo "=== Fixing Real IP Forwarding for DigitalOcean Kubernetes ==="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check prerequisites
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl not found${NC}"
    exit 1
fi

if ! command -v doctl &> /dev/null; then
    echo -e "${RED}Error: doctl not found${NC}"
    exit 1
fi

# Get cluster credentials
echo "Getting cluster credentials..."
doctl kubernetes cluster kubeconfig save --expiry-seconds 600 3b23a2dd-3391-4d1a-a478-e2a5564de99c

echo -e "\n${YELLOW}Step 1: Checking Load Balancer configuration${NC}"
echo "================================================"
# Get the load balancer created by nginx ingress
LB_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null)
if [ -z "$LB_IP" ]; then
    echo -e "${RED}No load balancer IP found!${NC}"
else
    echo "Load Balancer IP: $LB_IP"
    
    # Check if proxy protocol is enabled on the LB
    LB_ID=$(doctl compute load-balancer list --format ID,IP --no-header | grep "$LB_IP" | awk '{print $1}')
    if [ ! -z "$LB_ID" ]; then
        echo "Load Balancer ID: $LB_ID"
        echo "Checking proxy protocol status..."
        doctl compute load-balancer get $LB_ID --format ProxyProtocol
    fi
fi

echo -e "\n${YELLOW}Step 2: Updating nginx-ingress service to preserve client IPs${NC}"
echo "================================================"
# Patch the nginx-ingress-controller service
cat > /tmp/nginx-svc-patch.yaml << EOF
apiVersion: v1
kind: Service
metadata:
  name: ingress-nginx-controller
  namespace: ingress-nginx
  annotations:
    # DigitalOcean specific annotations
    service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol: "false"
    service.beta.kubernetes.io/do-loadbalancer-hostname: "lb.learnbytesting.ai"
spec:
  externalTrafficPolicy: Local
EOF

echo "Patching nginx-ingress service..."
kubectl patch svc ingress-nginx-controller -n ingress-nginx --patch-file=/tmp/nginx-svc-patch.yaml

echo -e "\n${YELLOW}Step 3: Updating nginx ConfigMap for proper header handling${NC}"
echo "================================================"
cat > /tmp/nginx-config.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-configuration
  namespace: ingress-nginx
data:
  # Real IP settings
  use-forwarded-headers: "true"
  compute-full-forwarded-for: "true"
  forwarded-for-header: "X-Forwarded-For"
  # Trust the load balancer
  use-proxy-protocol: "false"
  real-ip-header: "X-Forwarded-For"
  real-ip-recursive: "on"
  # Set trusted proxies (DigitalOcean internal ranges)
  proxy-real-ip-cidr: "10.0.0.0/8,172.16.0.0/12,192.168.0.0/16"
EOF

kubectl apply -f /tmp/nginx-config.yaml

echo -e "\n${YELLOW}Step 4: Applying ingress with proper annotations${NC}"
echo "================================================"
# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "Applying ingress configuration..."
kubectl apply -f "$PROJECT_ROOT/ingress/lbt_ingress.yaml"

echo -e "\n${YELLOW}Step 5: Restarting components${NC}"
echo "================================================"
echo "Restarting nginx controller..."
kubectl rollout restart deployment/ingress-nginx-controller -n ingress-nginx

echo "Waiting for nginx to be ready..."
kubectl rollout status deployment/ingress-nginx-controller -n ingress-nginx --timeout=180s

echo -e "\n${YELLOW}Step 6: Verifying configuration${NC}"
echo "================================================"
echo "Checking nginx configuration..."
kubectl exec -n ingress-nginx deployment/ingress-nginx-controller -- cat /etc/nginx/nginx.conf | grep -E "(real_ip|forwarded)" | head -10

echo -e "\n${YELLOW}Step 7: Testing real IP forwarding${NC}"
echo "================================================"
# Wait a moment for services to stabilize
sleep 10

echo "Making a test request to check headers..."
RESPONSE=$(curl -s -H "X-Test-IP: 8.8.8.8" https://learnbytesting.ai -o /dev/null -w '%{http_code}')
echo "Response code: $RESPONSE"

echo -e "\n${YELLOW}Step 8: Monitoring logs${NC}"
echo "================================================"
echo "Checking webapp-ssr logs for IP detection..."
kubectl logs -l app.kubernetes.io/instance=webapp-ssr --tail=20 | grep -E "(VisitorLogger|headers)" || echo "No recent logs found"

echo -e "\n${GREEN}✓ Configuration complete!${NC}"
echo "================================================"
echo ""
echo "Changes applied:"
echo "1. ✓ nginx-ingress service set to preserve client IPs (externalTrafficPolicy: Local)"
echo "2. ✓ nginx ConfigMap updated with proper real-ip settings"
echo "3. ✓ Ingress annotations applied for header forwarding"
echo "4. ✓ Components restarted"
echo ""
echo "Next steps:"
echo "1. Wait 2-3 minutes for all changes to propagate"
echo "2. Visit https://learnbytesting.ai from an external network"
echo "3. Check visitor logs for real IP addresses"
echo ""
echo "To monitor incoming requests:"
echo "  kubectl logs -f -l app.kubernetes.io/instance=webapp-ssr | grep VisitorLogger"
echo ""
echo "To check if real IPs are being captured:"
echo "  kubectl logs -l app.kubernetes.io/instance=webapp-ssr --tail=50 | grep -E 'Private IP detected|Available headers'"

# Cleanup temp files
rm -f /tmp/nginx-svc-patch.yaml /tmp/nginx-config.yaml