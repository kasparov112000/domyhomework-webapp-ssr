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
import { AppComponent, config } from './src/main.server';
import { visitorLogger } from './src/app/middleware/visitor-logger';
import testHeadersRouter from './src/app/routes/test-headers';

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