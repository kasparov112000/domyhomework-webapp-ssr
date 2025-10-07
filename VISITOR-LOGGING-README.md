# Visitor Logging System for LearnByTesting SSR

## Overview

The webapp-ssr Angular Universal application now includes comprehensive visitor logging that:
1. Tracks all visitor activity locally
2. Sends visitor logs to the central audit logs API
3. Provides real-time analytics

## Quick Start

1. **Install Dependencies**
   ```bash
   chmod +x install-dependencies.sh
   ./install-dependencies.sh
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run the Server**
   ```bash
   npm run build:ssr
   npm run serve:ssr
   ```

## What Gets Logged

For each visitor, we track:
- Timestamp
- IP Address
- User Agent & Browser/OS/Device
- HTTP Method & URL
- Referer
- Country/City/Region (from headers)
- Response Time
- Status Code

## Where Logs Are Stored

### Local Storage
- **Location**: `./logs/` directory (configurable)
- **Format**: Daily JSON files
- **Files**:
  - `visitor-log-YYYY-MM-DD.json` - Raw visitor logs
  - `visitor-stats-YYYY-MM-DD.json` - Aggregated statistics

### Central Audit API
- **Endpoint**: `https://orchestrator.learnbytesting.ai/api/auditLogs`
- **Entity Name**: `visitor-logs`
- **Entity Type**: `landing-page-visit`

## API Endpoints (Local)

The SSR server provides these endpoints:

```bash
# Get current day statistics
GET http://localhost:4000/api/visitor-stats

# Get recent visitors (last 100)
GET http://localhost:4000/api/recent-visitors

# Trigger cleanup of old logs
POST http://localhost:4000/api/cleanup-logs
```

## Querying Logs from Audit API

```bash
# Get all visitor logs
curl https://orchestrator.learnbytesting.ai/api/auditLogs?entityName=visitor-logs

# Get visitor logs for today
curl "https://orchestrator.learnbytesting.ai/api/auditLogs?entityName=visitor-logs&dateTime[\$gte]=$(date -u +%Y-%m-%d)"

# Get visitor logs from specific country
curl "https://orchestrator.learnbytesting.ai/api/auditLogs?entityName=visitor-logs&data.country=US"
```

## Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_VISITOR_LOGGING` | `true` | Enable/disable visitor logging |
| `SEND_TO_AUDIT_API` | `true` | Send logs to central API |
| `VISITOR_LOG_DIR` | `./logs` | Directory for log files |
| `VISITOR_LOG_RETENTION_DAYS` | `30` | Days to keep logs |
| `ORCHESTRATOR_URL` | `https://orchestrator.learnbytesting.ai` | API URL |
| `AUDIT_API_KEY` | - | API authentication key |

## Features

### Batch Processing
- Logs are sent to API in batches of 10
- 5-second delay between batches
- Automatic retry on failures

### Performance
- Asynchronous, non-blocking logging
- Minimal overhead (~1-2ms per request)
- Graceful degradation if API unavailable

### Privacy & Security
- IP addresses are hashed for privacy
- No personal data collected
- Secure API communication

## Monitoring

Check if logging is working:

```bash
# Check local logs
tail -f logs/visitor-log-$(date +%Y-%m-%d).json

# Check API integration
curl http://localhost:4000/api/visitor-stats | jq .

# Check audit API
curl "https://orchestrator.learnbytesting.ai/api/auditLogs?entityName=visitor-logs&\$limit=1"
```

## Troubleshooting

### No Logs Appearing
1. Check `ENABLE_VISITOR_LOGGING=true` in .env
2. Ensure logs directory is writable
3. Check console for errors

### API Integration Issues
1. Verify `SEND_TO_AUDIT_API=true`
2. Check `AUDIT_API_KEY` is set
3. Test orchestrator URL is accessible
4. Look for batch processing errors in console

### High Memory Usage
1. Reduce batch size in audit-log.service.ts
2. Decrease log retention days
3. Implement more aggressive cleanup

## Admin Dashboard

Access the analytics dashboard at:
```
https://learnbytesting.ai/admin/visitor-stats
```

Features:
- Real-time visitor statistics
- Browser/OS distribution charts
- Geographic visualization
- Top pages by traffic
- Recent visitor activity

## Architecture

```
┌─────────────────┐
│   Visitor       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  SSR Express    │
│   Middleware    │
└────────┬────────┘
         │
         ├──────────────┐
         ▼              ▼
┌─────────────────┐ ┌─────────────────┐
│  Local JSON     │ │  Audit API      │
│   Log Files     │ │  (Batched)      │
└─────────────────┘ └─────────────────┘
```

## Next Steps

1. Set up log rotation with logrotate
2. Configure backup strategy for logs
3. Set up monitoring alerts
4. Create analytics dashboards
5. Implement GDPR compliance features