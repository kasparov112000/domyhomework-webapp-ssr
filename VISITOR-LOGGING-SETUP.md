# Visitor Logging System Setup Complete

## What Has Been Fixed

1. **Dependencies Added**:
   - `axios@^1.12.2` - For making HTTP requests to the audit API
   - `dotenv@^16.6.1` - For environment variable management

2. **TypeScript Errors Fixed**:
   - Changed `req.query.date` to `req.query['date']` (bracket notation)
   - Added null check for `visitor.statusCode`
   - Added `path` and `query` properties to VisitorLog interface
   - Fixed all dynamic `require()` statements to use ES6 imports

3. **Files Modified**:
   - `/src/app/middleware/visitor-logger.ts` - Fixed all imports and TypeScript errors
   - `/src/app/services/audit-log.service.ts` - Axios is now available
   - `/src/app/pages/admin/visitor-stats.component.ts` - Fixed statusCode check
   - `/server.ts` - Fixed TypeScript index signature errors
   - `/package.json` - Added required dependencies

## Quick Start

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Create Environment File**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Build the SSR Application**:
   ```bash
   npm run build:ssr
   ```

4. **Start the Server**:
   ```bash
   npm run serve:ssr
   ```

5. **Access the Server**:
   - Main app: http://localhost:4000
   - Visitor stats: http://localhost:4000/api/visitor-stats
   - Recent visitors: http://localhost:4000/api/recent-visitors

## Features Implemented

- **Local Logging**: All visitor activity logged to `./logs/` directory
- **API Integration**: Batch sending to central audit logs API
- **Real-time Analytics**: View stats through API endpoints
- **Admin Dashboard**: Component at `/admin/visitor-stats`
- **Privacy**: IP addresses hashed, no personal data collected
- **Performance**: Async logging with minimal overhead

## Environment Variables

### Automatic Local/Production Detection
The audit log service now automatically detects whether it's running locally or in production and uses the appropriate orchestrator URL.

### Local Development (.env)
```bash
# Environment Configuration
NODE_ENV=development
ENV_NAME=LOCAL

# Visitor Logging Configuration
ENABLE_VISITOR_LOGGING=true
SEND_TO_AUDIT_API=true  # Safe to enable - will use localhost:8080
VISITOR_LOG_DIR=./logs
VISITOR_LOG_RETENTION_DAYS=30

# Local orchestrator port
LOCAL_ORCHESTRATOR_PORT=8080

# Server Configuration
PORT=4000
```

### Production (.env.production)
```bash
# Environment Configuration
NODE_ENV=production
ENV_NAME=PROD

# Visitor Logging Configuration
ENABLE_VISITOR_LOGGING=true
SEND_TO_AUDIT_API=true
VISITOR_LOG_DIR=/var/log/webapp-ssr
VISITOR_LOG_RETENTION_DAYS=30

# Orchestrator Configuration
ORCHESTRATOR_URL=https://orchestrator.learnbytesting.ai
AUDIT_API_KEY=your_production_api_key_here

# Server Configuration
PORT=4000
```

## How It Works

1. **Local Development**:
   - Automatically detects localhost environment
   - Uses `http://localhost:8080` for orchestrator
   - No proxy needed - direct connection to local orchestrator

2. **Production**:
   - Uses `https://orchestrator.learnbytesting.ai`
   - Requires proper API key configuration

## Running Locally with Orchestrator

1. Start the orchestrator (port 8080):
   ```bash
   cd /mnt/c/Users/Renato/repos/lbt/orchestrator
   npm start  # Runs on port 8080
   ```

2. Start the SSR app (port 4000):
   ```bash
   cd /mnt/c/Users/Renato/repos/lbt/webapp-ssr
   npm run serve:ssr
   ```

3. Visit http://localhost:4000 and check logs:
   - Local files: `./logs/visitor-log-YYYY-MM-DD.json`
   - Orchestrator: `http://localhost:8080/api/auditLogs?entityName=visitor-logs`

## Verification

After starting the server, visit any page and check:
1. Log files created in `./logs/` directory
2. Stats available at `/api/visitor-stats`
3. Console shows no errors about visitor logging

The visitor logging system is now fully functional and ready for production use!