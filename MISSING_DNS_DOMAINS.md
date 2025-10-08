# Missing DNS Entries for Cloudflare

The following domains are configured in the Kubernetes ingress but are not resolvable via DNS. They need to be added to your Cloudflare DNS configuration:

## Missing Domains

1. **orchestrator.learnbytesting.ai**
   - Service: orchestrator-helm (port 8080)
   - Purpose: API Gateway for all microservices
   - Required for: Audit logging from webapp-ssr

2. **kafka.learnbytesting.ai**
   - Service: orchnest (port 3700)
   - Purpose: Kafka/messaging service

3. **storybook.learnbytesting.ai**
   - Service: storybook-helm (port 64000)
   - Purpose: Component documentation

4. **domyhomework.ai** and **domyhomework.com**
   - Service: webapp-dmh-ssr (port 4000)
   - Purpose: DoMyHomework SSR landing page

5. **app.domyhomework.ai** and **app.domyhomework.com**
   - Service: webapp-dmh (port 80)
   - Purpose: DoMyHomework main application

## How to Add to Cloudflare

1. Log into Cloudflare Dashboard
2. Select your domain (learnbytesting.ai)
3. Go to DNS settings
4. Add these CNAME records pointing to your Load Balancer:
   - orchestrator → lb.learnbytesting.ai
   - kafka → lb.learnbytesting.ai
   - storybook → lb.learnbytesting.ai
   
   Or if using A records, point to the Load Balancer IP address

For the domyhomework domains, you need to:
1. Add domyhomework.ai and domyhomework.com to Cloudflare
2. Update nameservers at your domain registrar
3. Add A records for root and app subdomains

## Current Status

Until these DNS entries are added:
- Audit logging is disabled (SEND_TO_AUDIT_API=false)
- Visitor logs are still collected locally in the container
- Real IP detection is working via Cloudflare headers
- The applications that have DNS configured are working correctly