#!/bin/bash

# Script to apply updated ingress configuration with real IP preservation
echo "=== Applying updated ingress configuration ==="
echo ""
echo "This script will update the ingress to preserve real client IPs"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl not found. Please install kubectl first."
    exit 1
fi

# Check if doctl is available
if ! command -v doctl &> /dev/null; then
    echo "Error: doctl not found. Please install doctl first."
    exit 1
fi

# Get cluster credentials
echo "Getting cluster credentials..."
doctl kubernetes cluster kubeconfig save --expiry-seconds 600 3b23a2dd-3391-4d1a-a478-e2a5564de99c

# Check if we have access to the cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "Error: Cannot connect to Kubernetes cluster."
    exit 1
fi

echo "Current cluster context:"
kubectl config current-context

# Apply the ingress configuration
echo -e "\nApplying ingress configuration..."
kubectl apply -f "$PROJECT_ROOT/ingress/lbt_ingress.yaml"

# Check the status
echo -e "\nChecking ingress status..."
kubectl get ingress learnbytest-ingress

# Show the ingress annotations
echo -e "\nIngress annotations for real IP preservation:"
kubectl get ingress learnbytest-ingress -o jsonpath='{.metadata.annotations}' | jq '.' | grep -E "(use-forwarded|compute-full|proxy-protocol)"

# Check nginx controller configuration
echo -e "\nChecking nginx ingress controller pods..."
kubectl get pods -n ingress-nginx

echo -e "\nIngress configuration applied successfully!"
echo ""
echo "Real IP preservation annotations added:"
echo "  - nginx.ingress.kubernetes.io/use-forwarded-headers: true"
echo "  - nginx.ingress.kubernetes.io/compute-full-forwarded-for: true"
echo "  - nginx.ingress.kubernetes.io/use-proxy-protocol: false"
echo ""
echo "Note: It may take a few minutes for the changes to propagate."
echo "The nginx ingress controller should now preserve real client IPs in X-Forwarded-For headers."