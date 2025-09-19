import 'zone.js/node';

import express from 'express';
import { join } from 'path';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { renderApplication } from '@angular/platform-server';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent, config } from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/webapp-ssr');
  const browserDistFolder = join(distFolder, 'browser');
  
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