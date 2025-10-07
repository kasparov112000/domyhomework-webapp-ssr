import { Request, Response, Router } from 'express';

const router = Router();

// Test endpoint to debug headers
router.get('/api/test-headers', (req: Request, res: Response) => {
  const headers: any = {};
  
  // Collect all headers that might contain IP information
  const ipHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-original-forwarded-for',
    'cf-connecting-ip',
    'true-client-ip',
    'x-client-ip',
    'x-forwarded-host',
    'x-forwarded-proto',
    'forwarded',
    'via',
    'x-proxyuser-ip'
  ];
  
  ipHeaders.forEach(header => {
    if (req.headers[header]) {
      headers[header] = req.headers[header];
    }
  });
  
  // Also get connection info
  const connectionInfo = {
    remoteAddress: req.connection?.remoteAddress,
    remotePort: req.connection?.remotePort,
    localAddress: req.connection?.localAddress,
    localPort: req.connection?.localPort,
    socketRemoteAddress: req.socket?.remoteAddress,
    ip: req.ip,
    ips: req.ips
  };
  
  res.json({
    timestamp: new Date().toISOString(),
    headers: headers,
    allHeaders: req.headers,
    connection: connectionInfo,
    protocol: req.protocol,
    secure: req.secure,
    hostname: req.hostname,
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path,
    expressSettings: {
      trustProxy: req.app.get('trust proxy')
    }
  });
});

export default router;