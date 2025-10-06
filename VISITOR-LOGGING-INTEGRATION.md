# Visitor Logging Integration with Audit Logs API

This document describes the visitor logging system for the Angular Universal SSR app and its integration with the central audit logs API.

## Overview

The webapp-ssr application tracks all visitor activity and sends the data to two destinations:
1. **Local JSON log files** - for immediate access and backup
2. **Central Audit Logs API** - for centralized monitoring and analytics

## Features

### Local Logging
- Daily rotating JSON log files stored in `/logs` directory
- Real-time statistics aggregation
- Automatic cleanup of old logs (configurable retention)

### Audit API Integration
- Asynchronous batch processing (non-blocking)
- Automatic retry on failures
- Graceful degradation if API is unavailable
- Configurable batch size and delay

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Orchestrator API Configuration
ORCHESTRATOR_URL=https://orchestrator.learnbytesting.ai

# Audit Log API Configuration  
AUDIT_API_KEY=your-api-key-here

# Visitor Logging Configuration
ENABLE_VISITOR_LOGGING=true
VISITOR_LOG_DIR=./logs
VISITOR_LOG_RETENTION_DAYS=30

# Send logs to audit API
SEND_TO_AUDIT_API=true
```

### Audit Log Entry Format

Each visitor log is sent to the audit API with the following structure:

```json
{
  "entityName": "visitor-logs",
  "entityType": "landing-page-visit",
  "details": "GET /about - Mozilla/5.0...",
  "dateTime": "2024-01-20T10:30:00.000Z",
  "data": {
    "timestamp": "2024-01-20T10:30:00.000Z",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "method": "GET",
    "url": "https://learnbytesting.ai/about",
    "referer": "https://google.com",
    "country": "US",
    "city": "New York",
    "region": "NY",
    "browser": "Chrome",
    "os": "Windows",
    "device": "Desktop",
    "responseTime": 125,
    "statusCode": 200,
    "source": "webapp-ssr"
  },
  "ipAddress": "192.168.1.1"
}
```

## Implementation Details

### Visitor Logger Middleware

The `visitor-logger.ts` middleware:
1. Intercepts all HTTP requests
2. Extracts visitor information
3. Logs to local file
4. Sends to audit API asynchronously

### Audit Log Service

The `audit-log.service.ts`:
- Manages connection to audit logs API
- Implements batch processing for efficiency
- Handles retries and error recovery
- Provides graceful shutdown

### Batch Processing

- Logs are queued and sent in batches
- Default batch size: 10 entries
- Default batch delay: 5 seconds
- Automatic flush on shutdown

## API Endpoints

### Query Visitor Logs

Get visitor logs from the audit API:

```bash
# Get recent visitor logs
GET /api/auditLogs?entityName=visitor-logs&$sort=-dateTime&$limit=100

# Get visitor logs for specific date range
GET /api/auditLogs?entityName=visitor-logs&dateTime[$gte]=2024-01-20&dateTime[$lt]=2024-01-21

# Get visitor logs from specific country
GET /api/auditLogs?entityName=visitor-logs&data.country=US
```

### Analytics Queries

```bash
# Get unique visitors count
GET /api/auditLogs?entityName=visitor-logs&$distinct=ipAddress

# Get page view counts
GET /api/auditLogs?entityName=visitor-logs&$group=data.url
```

## Monitoring

### Check Audit API Health

```bash
# From SSR server
curl http://localhost:4000/api/visitor-stats

# From audit logs API
curl https://orchestrator.learnbytesting.ai/api/auditLogs?entityName=visitor-logs&$limit=1
```

### Log Files Location

```
webapp-ssr/
└── logs/
    ├── visitor-log-2024-01-20.json
    ├── visitor-stats-2024-01-20.json
    └── ...
```

## Troubleshooting

### Logs Not Appearing in Audit API

1. Check environment variables are set correctly
2. Verify `SEND_TO_AUDIT_API=true`
3. Check API key is valid
4. Look for error messages in console
5. Verify orchestrator URL is accessible

### High Memory Usage

1. Reduce batch size in `audit-log.service.ts`
2. Decrease retention days
3. Implement log rotation

### API Connection Errors

The system will:
- Continue logging locally
- Retry failed batches (with limit)
- Log errors to console
- Not impact visitor experience

## Security Considerations

1. **API Key**: Keep `AUDIT_API_KEY` secure
2. **PII Data**: IP addresses are logged - ensure compliance with privacy laws
3. **Log Retention**: Configure retention based on legal requirements
4. **Access Control**: Restrict access to log files and API endpoints

## Performance Impact

- Logging is asynchronous and non-blocking
- Minimal overhead (~1-2ms per request)
- Batch processing reduces API calls
- Local file writes are buffered

## Deployment

1. Set environment variables
2. Ensure `/logs` directory is writable
3. Configure log rotation (if needed)
4. Monitor disk space for log files
5. Set up backup for local logs

## Future Enhancements

- [ ] Add compression for old log files
- [ ] Implement log shipping to cloud storage
- [ ] Add real-time analytics dashboard
- [ ] Support for custom event tracking
- [ ] Integration with analytics platforms