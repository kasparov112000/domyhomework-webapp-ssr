# How to Add Orchestrator Subdomain in Cloudflare

## Steps to Add orchestrator.learnbytesting.ai

1. **Click the "Add record" button** (visible in your screenshot)

2. **Fill in the following:**
   - **Type**: CNAME
   - **Name**: orchestrator
   - **Target**: lb.learnbytesting.ai
   - **Proxy status**: Proxied (orange cloud ON)
   - **TTL**: Auto

3. **Click "Save"**

## Alternative: Using A Record
If you prefer using an A record instead of CNAME:

1. **First, find your Load Balancer's IP:**
   ```bash
   dig +short lb.learnbytesting.ai @8.8.8.8
   ```

2. **Then add the A record:**
   - **Type**: A
   - **Name**: orchestrator
   - **IPv4 address**: [The IP you got from the dig command]
   - **Proxy status**: Proxied (orange cloud ON)
   - **TTL**: Auto

## Other Subdomains to Add

While you're there, you should also add:

### kafka.learnbytesting.ai
- **Type**: CNAME
- **Name**: kafka
- **Target**: lb.learnbytesting.ai
- **Proxy status**: Proxied

### storybook.learnbytesting.ai
- **Type**: CNAME
- **Name**: storybook
- **Target**: lb.learnbytesting.ai
- **Proxy status**: Proxied

## Important Notes

- Make sure the **Proxy status is ON (orange cloud)** so you get Cloudflare's benefits including real IP headers
- It may take 1-5 minutes for DNS changes to propagate
- Once added, the orchestrator API will be accessible and audit logging can be re-enabled

## Verify It's Working

After adding the records, test with:
```bash
# Check DNS resolution
dig orchestrator.learnbytesting.ai +short

# Test the endpoint
curl https://orchestrator.learnbytesting.ai/health
```