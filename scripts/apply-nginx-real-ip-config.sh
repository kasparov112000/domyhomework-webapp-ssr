#!/bin/bash

echo "=== Applying nginx real IP configuration ==="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Check prerequisites
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}Error: kubectl not found${NC}"
    exit 1
fi

# Get cluster credentials if needed
if ! kubectl cluster-info &> /dev/null; then
    echo "Getting cluster credentials..."
    if command -v doctl &> /dev/null; then
        doctl kubernetes cluster kubeconfig save --expiry-seconds 600 3b23a2dd-3391-4d1a-a478-e2a5564de99c
    else
        echo -e "${RED}Error: Cannot connect to cluster and doctl not found${NC}"
        exit 1
    fi
fi

echo "Current cluster context:"
kubectl config current-context
echo ""

echo -e "${YELLOW}Step 1: Checking current configuration${NC}"
echo "================================================"
echo "Current nginx service externalTrafficPolicy:"
kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.spec.externalTrafficPolicy}' || echo "Not found"
echo -e "\n"

echo -e "${YELLOW}Step 2: Applying nginx real IP configuration${NC}"
echo "================================================"
kubectl apply -f "$PROJECT_ROOT/k8s/nginx-real-ip-config.yaml"

echo -e "\n${YELLOW}Step 3: Verifying configuration was applied${NC}"
echo "================================================"
echo "Service externalTrafficPolicy:"
kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.spec.externalTrafficPolicy}'
echo -e "\n"

echo "ConfigMap settings:"
kubectl get configmap -n ingress-nginx nginx-configuration -o yaml | grep -E "(use-forwarded|real-ip|proxy-protocol|cidr)" || echo "No settings found"

echo -e "\n${YELLOW}Step 4: Restarting nginx controller${NC}"
echo "================================================"
kubectl rollout restart deployment/ingress-nginx-controller -n ingress-nginx

echo "Waiting for rollout to complete..."
kubectl rollout status deployment/ingress-nginx-controller -n ingress-nginx --timeout=300s

echo -e "\n${YELLOW}Step 5: Checking nginx controller logs${NC}"
echo "================================================"
sleep 5  # Give it a moment to start
echo "Recent nginx startup logs:"
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx --tail=20 | grep -E "(real_ip|forwarded|configuration)" || echo "No relevant logs found"

echo -e "\n${YELLOW}Step 6: Testing configuration${NC}"
echo "================================================"
# Get the load balancer IP
LB_IP=$(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
if [ ! -z "$LB_IP" ]; then
    echo "Load Balancer IP: $LB_IP"
    echo -e "\nYou can now test the configuration by:"
    echo "1. Visit https://learnbytesting.ai/api/test-headers"
    echo "2. Check the response - it should show your real IP in the headers"
    echo "3. Monitor webapp-ssr logs for real IPs:"
    echo "   kubectl logs -f -l app.kubernetes.io/instance=webapp-ssr | grep VisitorLogger"
else
    echo -e "${RED}Warning: Could not find load balancer IP${NC}"
fi

echo -e "\n${GREEN}✓ Configuration applied successfully!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Wait 1-2 minutes for all changes to propagate"
echo "2. Visit https://learnbytesting.ai from an external network"
echo "3. Check visitor logs - they should now show real IPs instead of 10.244.x.x"
echo ""
echo "To monitor incoming requests with real IPs:"
echo "  kubectl logs -f -l app.kubernetes.io/instance=webapp-ssr | grep -E 'VisitorLogger|Private IP'"