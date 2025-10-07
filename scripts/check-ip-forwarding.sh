#!/bin/bash

echo "=== Checking IP Forwarding Configuration ==="
echo ""

# Check if we need to get credentials
if ! kubectl cluster-info &> /dev/null; then
    echo "Getting cluster credentials..."
    doctl kubernetes cluster kubeconfig save --expiry-seconds 600 3b23a2dd-3391-4d1a-a478-e2a5564de99c
fi

echo "1. Checking current ingress annotations..."
echo "================================================"
kubectl get ingress learnbytest-ingress -o jsonpath='{.metadata.annotations}' | jq . | grep -E "(use-forwarded|compute-full|proxy-protocol)" || echo "No IP forwarding annotations found!"

echo -e "\n2. Checking nginx configmap for real_ip settings..."
echo "================================================"
kubectl get configmap nginx-configuration -n ingress-nginx -o yaml | grep -E "(use-forwarded-headers|compute-full-forwarded-for|use-proxy-protocol)" || echo "No real IP settings in nginx configmap"

echo -e "\n3. Checking webapp-ssr deployment status..."
echo "================================================"
kubectl get deployment webapp-ssr -o wide
echo ""
echo "Latest pod:"
kubectl get pods -l app.kubernetes.io/instance=webapp-ssr --sort-by=.metadata.creationTimestamp | tail -1

echo -e "\n4. Checking webapp-ssr pod logs for IP detection..."
echo "================================================"
POD=$(kubectl get pods -l app.kubernetes.io/instance=webapp-ssr -o jsonpath='{.items[0].metadata.name}')
if [ ! -z "$POD" ]; then
    echo "Checking logs from pod: $POD"
    kubectl logs $POD --tail=50 | grep -E "(VisitorLogger|Private IP detected|x-forwarded)" || echo "No IP-related logs found"
else
    echo "No webapp-ssr pod found!"
fi

echo -e "\n5. Testing headers received by the pod..."
echo "================================================"
# Create a debug endpoint test
cat > /tmp/test-headers.yaml << EOF
apiVersion: v1
kind: Pod
metadata:
  name: debug-headers
  labels:
    app: debug
spec:
  containers:
  - name: debug
    image: nginx:alpine
    command: ["/bin/sh"]
    args: 
    - -c
    - |
      echo 'server {
        listen 80;
        location / {
          add_header Content-Type text/plain;
          return 200 "Headers received:\n\$http_x_forwarded_for\n\$http_x_real_ip\n\$http_x_original_forwarded_for\n\$http_cf_connecting_ip\n";
        }
      }' > /etc/nginx/conf.d/default.conf
      nginx -g 'daemon off;'
---
apiVersion: v1
kind: Service
metadata:
  name: debug-headers
spec:
  selector:
    app: debug
  ports:
  - port: 80
EOF

echo "Creating debug pod to test headers..."
kubectl apply -f /tmp/test-headers.yaml

echo -e "\n6. Checking if we need to update nginx ConfigMap..."
echo "================================================"
cat > /tmp/nginx-config-patch.yaml << EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-configuration
  namespace: ingress-nginx
data:
  use-forwarded-headers: "true"
  compute-full-forwarded-for: "true"
  use-proxy-protocol: "false"
  forwarded-for-header: "X-Forwarded-For"
  real-ip-header: "X-Forwarded-For"
  real-ip-recursive: "on"
EOF

echo "Patching nginx configuration..."
kubectl apply -f /tmp/nginx-config-patch.yaml

echo -e "\n7. Restarting nginx controller to apply changes..."
echo "================================================"
kubectl rollout restart deployment/ingress-nginx-controller -n ingress-nginx

echo -e "\nWaiting for nginx to restart..."
kubectl rollout status deployment/ingress-nginx-controller -n ingress-nginx --timeout=120s

echo -e "\n8. Summary and Next Steps"
echo "================================================"
echo "✓ Checked ingress annotations"
echo "✓ Updated nginx configmap for real IP forwarding"
echo "✓ Restarted nginx ingress controller"
echo ""
echo "Next steps:"
echo "1. Wait 2-3 minutes for changes to propagate"
echo "2. Test by visiting https://learnbytesting.ai"
echo "3. Check new visitor logs for real IPs"
echo ""
echo "To verify it's working, run:"
echo "  kubectl logs -l app.kubernetes.io/instance=webapp-ssr --tail=20 | grep VisitorLogger"
echo ""
echo "To clean up debug pod:"
echo "  kubectl delete pod debug-headers"
echo "  kubectl delete service debug-headers"