# Real IP Configuration for webapp-ssr

## Issue
The webapp-ssr application is receiving internal Kubernetes cluster IPs (10.244.x.x) instead of real client IPs. This affects analytics, rate limiting, and security features.

## Root Cause
The nginx-ingress LoadBalancer service is configured with `externalTrafficPolicy: Cluster`, which causes the source IP to be replaced with the node's IP when traffic is forwarded between nodes.

## Solution

### Step 1: Update Load Balancer Configuration
Run the fix script:
```bash
./fix-load-balancer-ip.sh
```

This changes `externalTrafficPolicy` from `Cluster` to `Local`, which preserves the original client IP.

### Step 2: Verify the Fix
Test that real IPs are now coming through:
```bash
# From external network
curl -s https://learnbytesting.ai/api/test-headers | grep -E 'x-forwarded-for|x-real-ip'

# Should show your real IP instead of 10.244.x.x
```

### Step 3: Monitor Application
Check that the webapp-ssr is now receiving real IPs:
```bash
kubectl logs -f $(kubectl get pods -l app.kubernetes.io/instance=webapp-ssr -o jsonpath='{.items[0].metadata.name}') | grep "Client IP:"
```

## Alternative Solutions

### If Using DigitalOcean Load Balancer
If you're still seeing internal IPs after the fix, enable proxy protocol:

```bash
# Enable proxy protocol on the load balancer
kubectl annotate svc nginx-ingress-ingress-nginx-controller \
  service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol="true" \
  --overwrite

# Also need to configure nginx to use proxy protocol
kubectl edit configmap nginx-ingress-ingress-nginx-controller

# Add under data:
#   use-proxy-protocol: "true"
```

### If Behind Cloudflare
If your domain uses Cloudflare, you'll need to:

1. Configure nginx to trust Cloudflare IPs:
```bash
kubectl edit configmap nginx-ingress-ingress-nginx-controller

# Add under data:
#   use-forwarded-headers: "true"
#   compute-full-forwarded-for: "true"
#   forwarded-for-header: "CF-Connecting-IP"
#   # Trust Cloudflare IP ranges
#   proxy-real-ip-cidr: "173.245.48.0/20,103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,141.101.64.0/18,108.162.192.0/18,190.93.240.0/20,188.114.96.0/20,197.234.240.0/22,198.41.128.0/17,162.158.0.0/15,104.16.0.0/12,172.64.0.0/13,131.0.72.0/22"
```

2. In webapp-ssr, look for CF-Connecting-IP header:
```javascript
// In your Express middleware
const getRealIp = (req) => {
  return req.headers['cf-connecting-ip'] || 
         req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress;
};
```

## Trade-offs

### externalTrafficPolicy: Local
**Pros:**
- Preserves real client IPs
- Better for security and analytics

**Cons:**
- Traffic only goes to nodes with nginx pods
- May cause uneven load distribution
- If a node has no nginx pod, connections to that node will fail

### externalTrafficPolicy: Cluster (default)
**Pros:**
- Better load distribution
- More resilient to node failures

**Cons:**
- Loses real client IPs
- Shows internal cluster IPs instead

## Monitoring

### Check Current Configuration
```bash
# Check externalTrafficPolicy
kubectl get svc nginx-ingress-ingress-nginx-controller -o jsonpath='{.spec.externalTrafficPolicy}'

# Check all load balancer annotations
kubectl get svc nginx-ingress-ingress-nginx-controller -o yaml | grep -A10 annotations

# Check nginx configuration
kubectl exec $(kubectl get pods -l app.kubernetes.io/name=ingress-nginx -o jsonpath='{.items[0].metadata.name}') -- cat /etc/nginx/nginx.conf | grep real_ip
```

### Test Headers
The `/api/test-headers` endpoint shows all received headers:
```bash
curl -s https://learnbytesting.ai/api/test-headers | python -m json.tool
```

Look for:
- `x-forwarded-for`: Should contain real IP
- `x-real-ip`: Should contain real IP
- `cf-connecting-ip`: If behind Cloudflare

## Rollback
If you need to revert to the original configuration:
```bash
kubectl patch svc nginx-ingress-ingress-nginx-controller -p '{"spec":{"externalTrafficPolicy":"Cluster"}}' --type merge
```