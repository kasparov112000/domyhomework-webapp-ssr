#!/bin/bash

echo "=== Comprehensive Real IP Diagnostics ==="
echo "Timestamp: $(date)"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get credentials if needed
if ! kubectl cluster-info &> /dev/null; then
    echo "Getting cluster credentials..."
    doctl kubernetes cluster kubeconfig save --expiry-seconds 600 3b23a2dd-3391-4d1a-a478-e2a5564de99c
fi

echo -e "${YELLOW}1. Checking nginx-ingress service configuration${NC}"
echo "================================================"
echo "Service details:"
kubectl get svc -n ingress-nginx ingress-nginx-controller -o yaml | grep -E "(externalTrafficPolicy|sessionAffinity|annotations)" -A 5

echo -e "\n${YELLOW}2. Checking nginx ConfigMap settings${NC}"
echo "================================================"
kubectl get configmap -n ingress-nginx nginx-configuration -o yaml | grep -E "(use-forwarded|real-ip|proxy-protocol|forwarded-for)" || echo "No real IP settings found!"

echo -e "\n${YELLOW}3. Checking ingress annotations${NC}"
echo "================================================"
kubectl get ingress learnbytest-ingress -o yaml | grep -A 20 "annotations:" | grep -E "(nginx.ingress|use-forwarded|compute-full)"

echo -e "\n${YELLOW}4. Testing actual headers received${NC}"
echo "================================================"
# Get the load balancer IP
LB_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Load Balancer IP: $LB_IP"

# Test with curl to see what headers are sent
echo -e "\nTesting direct request to load balancer:"
curl -s -H "Host: learnbytesting.ai" -H "X-Test-Real-IP: 8.8.8.8" -I http://$LB_IP | head -10

echo -e "\n${YELLOW}5. Checking nginx controller logs${NC}"
echo "================================================"
echo "Recent nginx logs mentioning real_ip or forwarded:"
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=100 | grep -E "(real_ip|forwarded|remote_addr)" | tail -10

echo -e "\n${YELLOW}6. Checking webapp-ssr deployment status${NC}"
echo "================================================"
# Get current deployment info
CURRENT_IMAGE=$(kubectl get deployment webapp-ssr -o jsonpath='{.spec.template.spec.containers[0].image}')
echo "Current image: $CURRENT_IMAGE"

# Check if latest code is deployed
LATEST_POD=$(kubectl get pods -l app.kubernetes.io/instance=webapp-ssr --sort-by=.metadata.creationTimestamp -o jsonpath='{.items[-1:].metadata.name}')
if [ ! -z "$LATEST_POD" ]; then
    echo "Latest pod: $LATEST_POD"
    echo "Pod age: $(kubectl get pod $LATEST_POD -o jsonpath='{.metadata.creationTimestamp}')"
    
    echo -e "\nChecking if pod has the updated visitor logger:"
    kubectl exec $LATEST_POD -- grep -q "x-original-forwarded-for" /app/dist/webapp-ssr/server/main.js && echo -e "${GREEN}✓ Pod has updated code${NC}" || echo -e "${RED}✗ Pod does NOT have updated code${NC}"
fi

echo -e "\n${YELLOW}7. Checking DigitalOcean Load Balancer${NC}"
echo "================================================"
if [ ! -z "$LB_IP" ]; then
    LB_ID=$(doctl compute load-balancer list --format ID,IP --no-header | grep "$LB_IP" | awk '{print $1}')
    if [ ! -z "$LB_ID" ]; then
        echo "Load Balancer ID: $LB_ID"
        echo "Load Balancer details:"
        doctl compute load-balancer get $LB_ID --format ID,IP,Status,ProxyProtocol,HealthCheck
    fi
fi

echo -e "\n${YELLOW}8. Quick Fix Attempt${NC}"
echo "================================================"
echo "Applying potential fixes..."

# Fix 1: Ensure nginx service preserves source IPs
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Service
metadata:
  name: ingress-nginx-controller
  namespace: ingress-nginx
  annotations:
    service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol: "false"
spec:
  externalTrafficPolicy: Local
EOF

# Fix 2: Update nginx config
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-configuration
  namespace: ingress-nginx
data:
  use-forwarded-headers: "true"
  compute-full-forwarded-for: "true"
  forwarded-for-header: "X-Forwarded-For"
  real-ip-header: "X-Forwarded-For"
  real-ip-recursive: "on"
  # Trust all private IPs
  proxy-real-ip-cidr: "10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,100.64.0.0/10"
EOF

echo -e "\n${YELLOW}9. Summary${NC}"
echo "================================================"
ISSUES=()

# Check for issues
kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.spec.externalTrafficPolicy}' | grep -q "Local" || ISSUES+=("nginx service not using externalTrafficPolicy: Local")
kubectl get pods -l app.kubernetes.io/instance=webapp-ssr -o jsonpath='{.items[0].status.containerStatuses[0].imageID}' | grep -q "$(date +%Y-%m-%d)" || ISSUES+=("webapp-ssr might not have latest deployment")

if [ ${#ISSUES[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ Configuration looks correct${NC}"
    echo "If still seeing pod IPs, try:"
    echo "1. Restart nginx controller: kubectl rollout restart deployment/ingress-nginx-controller -n ingress-nginx"
    echo "2. Wait for new deployment: The latest code changes need to be deployed"
else
    echo -e "${RED}Issues found:${NC}"
    for issue in "${ISSUES[@]}"; do
        echo "  - $issue"
    done
fi

echo -e "\n${YELLOW}10. Next Steps${NC}"
echo "================================================"
echo "1. Run: kubectl rollout restart deployment/ingress-nginx-controller -n ingress-nginx"
echo "2. Wait 2-3 minutes for restart"
echo "3. Check logs: kubectl logs -f -l app.kubernetes.io/instance=webapp-ssr | grep VisitorLogger"
echo "4. Visit https://learnbytesting.ai and check for new logs with real IPs"