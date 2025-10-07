# Cloudflare Quick Start - 10 Minutes to Real IPs

## What You Need
- Cloudflare account (free): https://cloudflare.com
- Access to your domain registrar

## Step-by-Step

### 1. Add Domain to Cloudflare (2 minutes)
1. Log into Cloudflare → "Add Site"
2. Enter: `learnbytesting.ai`
3. Choose FREE plan
4. Wait for DNS scan

### 2. Verify DNS Records (1 minute)
Ensure all your A records show "Proxied" (orange cloud):
- `learnbytesting.ai` → Your Load Balancer IP
- `app.learnbytesting.ai` → Your Load Balancer IP
- `orchestrator.learnbytesting.ai` → Your Load Balancer IP

### 3. Change Nameservers (5 minutes)
1. Copy the 2 nameservers Cloudflare gives you
2. Log into your domain registrar
3. Replace nameservers with Cloudflare's
4. Save

### 4. Wait & Configure (2 minutes)
While waiting for DNS (5-30 minutes usually):
1. In Cloudflare: SSL/TLS → Set to "Full (strict)"
2. In Cloudflare: Rules → Page Rules → Create:
   - `*learnbytesting.ai/*` → Always Use HTTPS

### 5. Test It Works
```bash
# Once Cloudflare is active, test:
curl -s https://learnbytesting.ai/api/test-headers | grep cf-connecting-ip

# You should see your real IP!
```

## That's It! 🎉

Your app will automatically:
- Read real IPs from `CF-Connecting-IP` header
- Get country from `CF-IPCountry` header
- Show geolocation in visitor logs

## DNS Propagation Check
```bash
# Check if Cloudflare is active:
dig learnbytesting.ai +short

# Should show Cloudflare IPs (104.x.x.x or 172.x.x.x)
```

## No Code Changes Needed!
Your webapp-ssr is already configured to work with Cloudflare headers.