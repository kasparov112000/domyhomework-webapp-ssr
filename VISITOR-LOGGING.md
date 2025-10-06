# Visitor Logging and Analytics for webapp-ssr

This document describes the visitor logging and analytics implementation for the LearnByTesting SSR landing page.

## Overview

The visitor logging system tracks and analyzes visitor traffic to the webapp-ssr landing page, providing insights into:
- Total visits and unique visitors
- Page views and popular pages
- Browser and operating system distribution
- Geographic data (when available)
- Response times and error rates
- Referrer sources

## Implementation Details

### 1. Visitor Logger Middleware

Located at: `/src/app/middleware/visitor-logger.ts`

The `VisitorLogger` class provides:
- Express middleware that intercepts all HTTP requests
- Automatic parsing of user agent strings for browser/OS/device detection
- Country detection from various HTTP headers
- File-based logging with daily rotation
- In-memory statistics aggregation

### 2. Server Integration

The middleware is integrated in `server.ts`:

```typescript
import { visitorLogger } from './src/app/middleware/visitor-logger';

// Add visitor logging middleware
server.use(visitorLogger.middleware());
```

### 3. API Endpoints

The following endpoints are available:

- `GET /api/visitor-stats` - Get daily statistics (optional `?date=YYYY-MM-DD`)
- `GET /api/recent-visitors?minutes=60` - Get recent visitor logs
- `POST /api/cleanup-logs` - Trigger cleanup of old log files

### 4. Admin Dashboard

Located at: `/src/app/pages/admin/visitor-stats.component.ts`

Access the dashboard at: `/admin/visitor-stats`

Features:
- Real-time statistics display
- Auto-refresh every 30 seconds
- Top pages visualization
- Browser and OS distribution charts
- Recent visitors table
- Manual refresh and log cleanup options

## Log File Structure

### Visitor Logs

Daily log files are stored in `/logs/visitor-log-YYYY-MM-DD.json`

Each line contains a JSON object with:
```json
{
  "timestamp": "2024-01-20T10:30:45.123Z",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "method": "GET",
  "url": "/features",
  "referer": "https://google.com",
  "country": "US",
  "browser": "Chrome",
  "os": "Windows",
  "device": "Desktop",
  "responseTime": 125,
  "statusCode": 200
}
```

### Statistics Files

Daily statistics are stored in `/logs/visitor-stats-YYYY-MM-DD.json`

Contains aggregated data:
```json
{
  "date": "2024-01-20",
  "totalVisits": 1542,
  "uniqueVisitorCount": 687,
  "pageViews": {
    "/": 543,
    "/features": 234,
    "/pricing": 187
  },
  "browsers": {
    "Chrome": 892,
    "Safari": 345,
    "Firefox": 234
  },
  "operatingSystems": {
    "Windows": 743,
    "macOS": 456,
    "Linux": 234
  },
  "countries": {
    "US": 567,
    "UK": 234,
    "CA": 123
  },
  "topReferers": {
    "https://google.com": 345,
    "https://github.com": 234
  },
  "averageResponseTime": 143.5,
  "errorCount": 12
}
```

## Configuration

### Excluding Routes

By default, the logger skips:
- Static assets (files with extensions)
- Health check endpoint (`/health`)
- API endpoints (`/api/*`)

To modify exclusions, edit the middleware in `visitor-logger.ts`:

```typescript
// Skip logging for specific routes
if (req.url.includes('.') || req.url === '/health' || req.url.startsWith('/api/')) {
  return next();
}
```

### Log Retention

Logs are kept for 30 days by default. To change:
- Modify the default in `cleanupOldLogs(daysToKeep: number = 30)`
- Or pass a different value when calling the cleanup endpoint

### Country Detection

The logger checks these headers for country information:
- `cf-ipcountry` (Cloudflare)
- `x-vercel-ip-country` (Vercel)
- `x-country-code`
- `x-real-country`

## Security Considerations

1. **IP Privacy**: IPs are logged but should be handled according to privacy regulations
2. **Access Control**: The admin dashboard should be protected in production
3. **Log Rotation**: Automatic cleanup prevents excessive disk usage
4. **Sensitive Data**: No sensitive user data is logged

## Performance Impact

The logging system is designed for minimal performance impact:
- Asynchronous file writes
- In-memory statistics aggregation
- Periodic saves (every 10 visits)
- Efficient middleware implementation

## Deployment Notes

1. Ensure the `/logs` directory is created and writable
2. Consider mounting a persistent volume for logs in containerized deployments
3. Set up a cron job or scheduled task for regular log cleanup
4. Monitor disk usage as logs can grow quickly on high-traffic sites

## Usage Examples

### Viewing Current Stats

```bash
curl http://localhost:4000/api/visitor-stats
```

### Getting Recent Visitors

```bash
curl http://localhost:4000/api/recent-visitors?minutes=30
```

### Triggering Log Cleanup

```bash
curl -X POST http://localhost:4000/api/cleanup-logs \
  -H "Content-Type: application/json" \
  -d '{"daysToKeep": 7}'
```

## Future Enhancements

1. **Database Storage**: Consider moving to a database for better querying
2. **Real-time Dashboard**: Add WebSocket support for live updates
3. **Advanced Analytics**: Add conversion tracking, session duration, etc.
4. **Export Options**: Add CSV/Excel export functionality
5. **Alerting**: Set up alerts for traffic spikes or errors
6. **Geographic Visualization**: Add map visualization for country data