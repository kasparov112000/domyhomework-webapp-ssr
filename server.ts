import 'zone.js/node';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import express from 'express';
import { join } from 'path';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { renderApplication } from '@angular/platform-server';
import { bootstrapApplication } from '@angular/platform-browser';
import axios from 'axios';
import { AppComponent, config } from './src/main.server';
import { visitorLogger } from './src/app/middleware/visitor-logger';
import testHeadersRouter from './src/app/routes/test-headers';

// Lazy load geoip-lite for registration IP tracking
let geoip: any = null;
try {
  geoip = require('geoip-lite');
} catch (error: any) {
  console.warn('[Server] geoip-lite not available for registration tracking');
}

// Helper function to get client IP from request
function getClientIp(req: express.Request): string {
  // Priority order for getting real IP
  const ipHeaders = [
    'cf-connecting-ip',      // Cloudflare
    'x-real-ip',             // Nginx
    'x-forwarded-for',       // Standard proxy header
    'x-client-ip',
    'true-client-ip',
    'x-original-forwarded-for'
  ];

  for (const header of ipHeaders) {
    const value = req.headers[header];
    if (value) {
      const ip = Array.isArray(value) ? value[0] : value.split(',')[0].trim();
      if (ip && ip !== '::1' && ip !== '127.0.0.1') {
        return ip;
      }
    }
  }

  // Fallback to socket remote address
  const socketIp = req.socket?.remoteAddress || req.ip || '0.0.0.0';
  return socketIp.replace('::ffff:', '');
}

// Interface for geolocation data
interface GeoData {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
}

// Helper function to get geolocation from headers or geoip
function getGeolocation(req: express.Request, ip: string): GeoData {
  const result: GeoData = {};

  // First check headers (Cloudflare, Vercel, etc.)
  const countryHeaders = ['cf-ipcountry', 'x-vercel-ip-country', 'x-country-code'];
  for (const header of countryHeaders) {
    const value = req.headers[header];
    if (value && typeof value === 'string') {
      result.country = value;
      break;
    }
  }

  // Fall back to geoip lookup for full geolocation
  if (geoip && ip && !['::1', '127.0.0.1', '0.0.0.0'].includes(ip)) {
    try {
      const geo = geoip.lookup(ip);
      if (geo) {
        if (!result.country && geo.country) {
          result.country = geo.country;
        }
        result.region = geo.region;
        result.city = geo.city;
        result.timezone = geo.timezone;
      }
    } catch (e) {
      // Ignore geoip errors
    }
  }

  return result;
}

// Helper function to determine registration site from request
function getRegistrationSite(req: express.Request): string {
  const host = req.headers.host || '';
  const referer = req.headers.referer || '';

  if (host.includes('domyhomework') || referer.includes('domyhomework')) {
    return 'DMH';
  }
  return 'LBT';
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/webapp-ssr');
  const browserDistFolder = join(distFolder, 'browser');
  
  // Trust proxy - essential for getting real IPs behind nginx/load balancer
  server.set('trust proxy', true);
  console.log('✅ Trust proxy enabled for real IP detection');
  
  // Check if index.html exists in the browser folder
  const indexPath = join(browserDistFolder, 'index.html');
  const indexHtml = existsSync(indexPath) ? readFileSync(indexPath, 'utf-8') : '';
  
  if (!indexHtml) {
    console.error('ERROR: index.html not found at:', indexPath);
    console.error('Dist folder contents:', existsSync(distFolder) ? readdirSync(distFolder) : 'Folder does not exist');
    if (existsSync(browserDistFolder)) {
      console.error('Browser folder contents:', readdirSync(browserDistFolder).slice(0, 10));
    }
  }

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Add body parser for JSON requests
  server.use(express.json());

  // Add visitor logging middleware if enabled
  if (process.env['ENABLE_VISITOR_LOGGING'] !== 'false') {
    console.log('🔍 Visitor logging enabled');
    console.log(`📁 Logs directory: ${process.env['VISITOR_LOG_DIR'] || './logs'}`);
    console.log(`🌐 Send to API: ${process.env['SEND_TO_AUDIT_API'] !== 'false' ? 'Yes' : 'No'}`);
    if (process.env['SEND_TO_AUDIT_API'] !== 'false') {
      const isLocal = process.env['NODE_ENV'] === 'development' || 
                      process.env['ENV_NAME'] === 'LOCAL' || 
                      !process.env['NODE_ENV'];
      console.log(`🎯 Orchestrator: ${isLocal ? 'http://localhost:8080' : 'https://orchestrator.learnbytesting.ai'}`);
    }
    server.use(visitorLogger.middleware());
  } else {
    console.log('❌ Visitor logging disabled');
  }

  // Test endpoint for visitor logging
  server.get('/test-visitor-log', (req, res) => {
    console.log('Test endpoint hit - this should trigger visitor logging');
    res.json({
      message: 'Visitor logging test',
      timestamp: new Date().toISOString(),
      visitorLoggingEnabled: process.env['ENABLE_VISITOR_LOGGING'] !== 'false',
      sendToApiEnabled: process.env['SEND_TO_AUDIT_API'] !== 'false'
    });
  });

  // Health check endpoint
  server.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      distFolder: distFolder,
      browserDistFolder: browserDistFolder,
      distExists: existsSync(distFolder),
      browserDistExists: existsSync(browserDistFolder),
      indexPath: indexPath,
      indexExists: existsSync(indexPath),
      distContents: existsSync(distFolder) ? readdirSync(distFolder).slice(0, 10) : [],
      browserContents: existsSync(browserDistFolder) ? readdirSync(browserDistFolder).slice(0, 10) : [],
      cwd: process.cwd()
    });
  });

  // Visitor stats API endpoints
  server.get('/api/visitor-stats', (req, res) => {
    const date = req.query['date'] ? new Date(req.query['date'] as string) : undefined;
    const stats = visitorLogger.getStats(date);
    res.json(stats || { error: 'No stats available for the specified date' });
  });

  server.get('/api/recent-visitors', (req, res) => {
    const minutes = parseInt(req.query['minutes'] as string) || 60;
    const visitors = visitorLogger.getRecentVisitors(minutes);
    res.json(visitors);
  });

  // Test headers route for debugging
  server.use(testHeadersRouter);

  // Trigger cleanup of old logs
  server.post('/api/cleanup-logs', (req, res) => {
    const daysToKeep = parseInt(req.body?.daysToKeep) || 30;
    visitorLogger.cleanupOldLogs(daysToKeep);
    res.json({ message: `Old logs cleanup triggered (keeping last ${daysToKeep} days)` });
  });

  // API Proxy configuration for authentication endpoints
  const isLocal = process.env['NODE_ENV'] === 'development' ||
                  process.env['ENV_NAME'] === 'LOCAL' ||
                  !process.env['NODE_ENV'];

  // Proxy /apg requests to orchnest service
  const orchnestTarget = isLocal
    ? 'http://localhost:3700'
    : 'https://orchestrator.learnbytesting.ai';

  console.log(`🔗 API Proxy: /apg -> ${orchnestTarget}`);

  // Manual proxy for /apg/* routes
  server.all('/apg/*', async (req, res) => {
    const targetPath = req.url.replace(/^\/apg/, '');
    const targetUrl = `${orchnestTarget}${targetPath}`;

    console.log(`[Proxy] ${req.method} ${req.url} -> ${targetUrl}`);

    // Prepare request body
    let requestBody = req.body;

    // For registration requests, add IP, geolocation, and site information
    if (targetPath.includes('/user/register') && req.method === 'POST') {
      const clientIp = getClientIp(req);
      const geoData = getGeolocation(req, clientIp);
      const registrationSite = getRegistrationSite(req);

      console.log(`[Proxy] Registration from IP: ${clientIp}, Country: ${geoData.country || 'Unknown'}, Site: ${registrationSite}`);

      // Add registration metadata to the request body
      requestBody = {
        ...req.body,
        registrationIp: clientIp,
        registrationCountry: geoData.country,
        registrationRegion: geoData.region,
        registrationCity: geoData.city,
        registrationTimezone: geoData.timezone,
        registrationUserAgent: req.headers['user-agent'],
        registrationTimestamp: new Date().toISOString(),
        registrationSite: registrationSite
      };
    }

    try {
      const response = await axios({
        method: req.method as any,
        url: targetUrl,
        data: requestBody,
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/json',
          'Accept': req.headers['accept'] || 'application/json'
        },
        timeout: 30000,
        validateStatus: () => true // Don't throw on any status
      });

      res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error('[Proxy Error]', error.message);
      res.status(502).json({ error: 'Proxy error', message: error.message });
    }
  });

  // Serve static files from the browser folder
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res) => {
    const { protocol, originalUrl, headers } = req;
    const url = `${protocol}://${headers.host}${originalUrl}`;
    
    const bootstrap = () => bootstrapApplication(AppComponent, {
      providers: [
        ...config.providers,
        { provide: APP_BASE_HREF, useValue: req.baseUrl }
      ]
    });
    
    if (!indexHtml) {
      res.status(500).send(`
        <h1>Server Error</h1>
        <p>index.html not found. The application may not have been built correctly.</p>
        <p>Looking for: ${indexPath}</p>
      `);
      return;
    }
    
    renderApplication(bootstrap, {
      document: indexHtml,
      url
    }).then((html) => {
      res.send(html);
    }).catch((err) => {
      console.error('SSR Error:', err);
      res.send(indexHtml); // Fallback to client-side rendering
    });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}