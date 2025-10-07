# Cloudflare Setup Guide for LearnByTesting.ai

This guide will help you set up Cloudflare to properly forward real client IPs to your application.

## Prerequisites
- Access to your domain registrar (where you bought learnbytesting.ai)
- A Cloudflare account (free tier is sufficient)

## Step 1: Add Your Domain to Cloudflare

1. Sign up for a free Cloudflare account at https://cloudflare.com
2. Click "Add a Site" and enter: `learnbytesting.ai`
3. Select the FREE plan
4. Cloudflare will scan your existing DNS records

## Step 2: Review DNS Records

Cloudflare should detect your existing records. Ensure these are present:

```
Type | Name | Content | Proxy Status
-----|------|---------|-------------
A    | @    | [Your DO Load Balancer IP] | Proxied (orange cloud)
A    | app  | [Your DO Load Balancer IP] | Proxied (orange cloud)
A    | orchestrator | [Your DO Load Balancer IP] | Proxied (orange cloud)
A    | storybook | [Your DO Load Balancer IP] | Proxied (orange cloud)
CNAME| www  | learnbytesting.ai | Proxied (orange cloud)
```

**IMPORTANT**: Make sure the proxy status shows "Proxied" (orange cloud icon) for all records. This ensures traffic goes through Cloudflare.

## Step 3: Update Nameservers

1. Cloudflare will provide 2 nameservers (e.g., `anna.ns.cloudflare.com`, `bob.ns.cloudflare.com`)
2. Log into your domain registrar (GoDaddy, Namecheap, etc.)
3. Find the nameserver/DNS settings
4. Replace the existing nameservers with Cloudflare's nameservers
5. Save the changes

## Step 4: Wait for Propagation

- DNS propagation can take 5 minutes to 48 hours (usually under 30 minutes)
- Cloudflare will email you when your site is active

## Step 5: Configure Cloudflare Settings

Once active, configure these settings in the Cloudflare dashboard:

### SSL/TLS Settings
1. Go to SSL/TLS → Overview
2. Set encryption mode to "Full (strict)"

### Page Rules (Free - 3 rules)
1. Go to Rules → Page Rules
2. Create these rules:

**Rule 1**: Always HTTPS
- URL: `*learnbytesting.ai/*`
- Setting: Always Use HTTPS

**Rule 2**: Cache Everything for Static Assets
- URL: `*learnbytesting.ai/*.js`
- Setting: Cache Level → Cache Everything
- Setting: Edge Cache TTL → 1 month

**Rule 3**: Bypass Cache for API
- URL: `*learnbytesting.ai/api/*`
- Setting: Cache Level → Bypass

### Security Settings
1. Go to Security → Settings
2. Security Level: Medium
3. Challenge Passage: 30 minutes

### Speed Settings
1. Go to Speed → Optimization
2. Enable:
   - Auto Minify (JavaScript, CSS, HTML)
   - Brotli compression
   - HTTP/2
   - HTTP/3 (with QUIC)

## Step 6: Test Real IP Detection

Once Cloudflare is active, test if real IPs are being forwarded:

```bash
# Test from your local machine
curl -s https://learnbytesting.ai/api/test-headers | jq '.headers["cf-connecting-ip"]'

# You should see your real IP address
```

## Step 7: Monitor Visitor Logs

Check your MongoDB visitor logs. You should now see:
- Real IP addresses in the `ip` field
- Country information populated
- Additional Cloudflare headers like `cf-connecting-ip`, `cf-ipcountry`

## Benefits of Using Cloudflare

1. **Real IP Forwarding**: Cloudflare adds headers with real client IPs
2. **Free SSL Certificate**: Automatic HTTPS for all subdomains
3. **DDoS Protection**: Basic protection included in free tier
4. **Global CDN**: Static assets cached at edge locations
5. **Analytics**: Basic traffic analytics in free tier
6. **Page Rules**: Control caching and security per URL pattern

## Troubleshooting

### Still seeing internal IPs?
1. Ensure DNS records show "Proxied" (orange cloud)
2. Wait for DNS propagation (check with `dig learnbytesting.ai`)
3. Clear your browser cache

### SSL errors?
1. Ensure SSL/TLS mode is set to "Full (strict)"
2. Wait 10 minutes for SSL certificate provisioning

### Site not loading?
1. Check if nameservers have propagated: `dig NS learnbytesting.ai`
2. Ensure your origin server (DO Load Balancer) is accessible
3. Check Cloudflare Analytics for errors

## Your Application is Ready!

Your webapp-ssr application is already configured to:
- Check for `CF-Connecting-IP` header (highest priority)
- Extract real IPs from Cloudflare headers
- Log country information from geolocation
- Handle all Cloudflare-specific headers

No code changes needed - just point your domain through Cloudflare!