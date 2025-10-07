import { Request, Response, NextFunction } from 'express';
import { writeFileSync, appendFileSync, existsSync, mkdirSync, readdirSync, unlinkSync, statSync, readFileSync } from 'fs';
import { join } from 'path';
import { AuditLogService } from '../services/audit-log.service';

export interface VisitorLog {
  timestamp: string;
  ip: string;
  userAgent: string;
  method: string;
  url: string;
  path: string;
  query?: any;
  referer: string | undefined;
  country?: string;
  city?: string;
  region?: string;
  browser?: string;
  os?: string;
  device?: string;
  responseTime?: number;
  statusCode?: number;
  language?: string;
  host?: string;
  protocol?: string;
  secure?: boolean;
  headers?: {
    'x-real-ip'?: string;
    'x-forwarded-for'?: string;
    'x-forwarded-proto'?: string;
    'cf-connecting-ip'?: string;
    'cf-ipcountry'?: string;
    'cf-ray'?: string;
  };
}

interface DailyStats {
  date: string;
  totalVisits: number;
  uniqueVisitors: Set<string>;
  pageViews: { [key: string]: number };
  browsers: { [key: string]: number };
  operatingSystems: { [key: string]: number };
  countries: { [key: string]: number };
  topReferers: { [key: string]: number };
  averageResponseTime: number;
  errorCount: number;
}

export class VisitorLogger {
  private logsDir: string;
  private dailyStats: Map<string, DailyStats> = new Map();
  
  constructor(logsDir: string = join(process.cwd(), 'logs')) {
    this.logsDir = logsDir;
    this.ensureLogsDirectory();
  }
  
  private ensureLogsDirectory(): void {
    if (!existsSync(this.logsDir)) {
      mkdirSync(this.logsDir, { recursive: true });
    }
  }
  
  private getLogFileName(date: Date = new Date()): string {
    const dateStr = date.toISOString().split('T')[0];
    return join(this.logsDir, `visitor-log-${dateStr}.json`);
  }
  
  private getStatsFileName(date: Date = new Date()): string {
    const dateStr = date.toISOString().split('T')[0];
    return join(this.logsDir, `visitor-stats-${dateStr}.json`);
  }
  
  private parseUserAgent(userAgent: string): { browser?: string; os?: string; device?: string } {
    const result: { browser?: string; os?: string; device?: string } = {};
    
    // Simple browser detection
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      result.browser = 'Chrome';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      result.browser = 'Safari';
    } else if (userAgent.includes('Firefox')) {
      result.browser = 'Firefox';
    } else if (userAgent.includes('Edg')) {
      result.browser = 'Edge';
    } else {
      result.browser = 'Other';
    }
    
    // Simple OS detection
    if (userAgent.includes('Windows')) {
      result.os = 'Windows';
    } else if (userAgent.includes('Mac OS')) {
      result.os = 'macOS';
    } else if (userAgent.includes('Linux')) {
      result.os = 'Linux';
    } else if (userAgent.includes('Android')) {
      result.os = 'Android';
    } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      result.os = 'iOS';
    } else {
      result.os = 'Other';
    }
    
    // Simple device detection
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      result.device = 'Mobile';
    } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
      result.device = 'Tablet';
    } else {
      result.device = 'Desktop';
    }
    
    return result;
  }
  
  private extractCountryFromHeaders(req: Request): string | undefined {
    // Check various headers that might contain country info
    const countryHeaders = [
      'cf-ipcountry', // Cloudflare
      'x-vercel-ip-country', // Vercel
      'x-country-code',
      'x-real-country'
    ];
    
    for (const header of countryHeaders) {
      const value = req.headers[header];
      if (value && typeof value === 'string') {
        return value;
      }
    }
    
    return undefined;
  }
  
  public middleware() {
    const self = this;
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      
      // Skip logging for static assets, health checks, and monitoring probes
      const userAgent = req.headers['user-agent'] || '';
      const isMonitoringAgent = userAgent.includes('kube-probe') || 
                               userAgent.includes('GoogleHC') || 
                               userAgent.includes('uptime') ||
                               userAgent.includes('health') ||
                               userAgent.includes('monitor') ||
                               userAgent === '';
      
      if (req.url.includes('.') || 
          req.url === '/health' || 
          req.url === '/healthcheck' ||
          isMonitoringAgent) {
        return next();
      }
      
      console.log(`[VisitorLogger] Processing request: ${req.method} ${req.url}`);
      
      // Capture response details
      const originalSend = res.send;
      res.send = function(data) {
        res.send = originalSend;
        
        const responseTime = Date.now() - startTime;
        
        // Extract real visitor IP from various headers
        const realIp = req.headers['x-real-ip'] as string ||
                      req.headers['x-forwarded-for'] as string ||
                      req.headers['cf-connecting-ip'] as string || // Cloudflare
                      req.headers['x-client-ip'] as string ||
                      req.socket.remoteAddress || 
                      'unknown';
        
        const ip = realIp.split(',')[0].trim(); // Get first IP if multiple
        const userAgent = req.headers['user-agent'] || 'unknown';
        const { browser, os, device } = self.parseUserAgent(userAgent);
        
        const visitorLog: VisitorLog = {
          timestamp: new Date().toISOString(),
          ip: ip,
          userAgent,
          method: req.method,
          url: req.url,
          path: req.path,
          query: req.query,
          referer: req.headers['referer'],
          country: self.extractCountryFromHeaders(req),
          browser,
          os,
          device,
          responseTime,
          statusCode: res.statusCode,
          // Additional information
          language: req.headers['accept-language']?.split(',')[0] || undefined,
          host: req.headers['host'],
          protocol: req.protocol,
          secure: req.secure,
          headers: {
            'x-real-ip': req.headers['x-real-ip'] as string,
            'x-forwarded-for': req.headers['x-forwarded-for'] as string,
            'x-forwarded-proto': req.headers['x-forwarded-proto'] as string,
            'cf-connecting-ip': req.headers['cf-connecting-ip'] as string,
            'cf-ipcountry': req.headers['cf-ipcountry'] as string,
            'cf-ray': req.headers['cf-ray'] as string
          }
        };
        
        // Log to file
        self.logVisitor(visitorLog);
        
        // Update stats
        self.updateStats(visitorLog);
        
        return originalSend.call(this, data);
      };
      
      next();
    };
  }
  
  private logVisitor(log: VisitorLog): void {
    try {
      const logFile = this.getLogFileName();
      const logLine = JSON.stringify(log) + '\n';
      
      appendFileSync(logFile, logLine, 'utf8');
      
      // Also send to audit logs API (async, non-blocking)
      console.log('[VisitorLogger] Sending log to audit service...');
      AuditLogService.getInstance().logVisitor(log).catch(error => {
        console.error('[VisitorLogger] Error sending to audit logs:', error);
      });
    } catch (error) {
      console.error('Error writing visitor log:', error);
    }
  }
  
  private updateStats(log: VisitorLog): void {
    const dateStr = new Date().toISOString().split('T')[0];
    let stats = this.dailyStats.get(dateStr);
    
    if (!stats) {
      stats = {
        date: dateStr,
        totalVisits: 0,
        uniqueVisitors: new Set(),
        pageViews: {},
        browsers: {},
        operatingSystems: {},
        countries: {},
        topReferers: {},
        averageResponseTime: 0,
        errorCount: 0
      };
      this.dailyStats.set(dateStr, stats);
    }
    
    // Update stats
    stats.totalVisits++;
    stats.uniqueVisitors.add(log.ip);
    
    // Page views
    stats.pageViews[log.url] = (stats.pageViews[log.url] || 0) + 1;
    
    // Browsers
    if (log.browser) {
      stats.browsers[log.browser] = (stats.browsers[log.browser] || 0) + 1;
    }
    
    // Operating systems
    if (log.os) {
      stats.operatingSystems[log.os] = (stats.operatingSystems[log.os] || 0) + 1;
    }
    
    // Countries
    if (log.country) {
      stats.countries[log.country] = (stats.countries[log.country] || 0) + 1;
    }
    
    // Referers
    if (log.referer && !log.referer.includes('learnbytesting.ai')) {
      stats.topReferers[log.referer] = (stats.topReferers[log.referer] || 0) + 1;
    }
    
    // Response time (running average)
    if (log.responseTime) {
      const currentAvg = stats.averageResponseTime;
      const currentTotal = currentAvg * (stats.totalVisits - 1);
      stats.averageResponseTime = (currentTotal + log.responseTime) / stats.totalVisits;
    }
    
    // Error count
    if (log.statusCode && log.statusCode >= 400) {
      stats.errorCount++;
    }
    
    // Periodically save stats to file
    if (stats.totalVisits % 10 === 0) {
      this.saveStats(dateStr);
    }
  }
  
  private saveStats(dateStr: string): void {
    const stats = this.dailyStats.get(dateStr);
    if (!stats) return;
    
    try {
      const statsFile = this.getStatsFileName(new Date(dateStr));
      const statsToSave = {
        ...stats,
        uniqueVisitorCount: stats.uniqueVisitors.size,
        uniqueVisitors: undefined // Don't save the Set
      };
      
      writeFileSync(statsFile, JSON.stringify(statsToSave, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving visitor stats:', error);
    }
  }
  
  public getStats(date?: Date): any {
    const dateStr = (date || new Date()).toISOString().split('T')[0];
    const stats = this.dailyStats.get(dateStr);
    
    if (stats) {
      return {
        ...stats,
        uniqueVisitorCount: stats.uniqueVisitors.size,
        uniqueVisitors: Array.from(stats.uniqueVisitors)
      };
    }
    
    // Try to load from file
    try {
      const statsFile = this.getStatsFileName(date);
      if (existsSync(statsFile)) {
        const fileContent = JSON.parse(readFileSync(statsFile, 'utf8'));
        return fileContent;
      }
    } catch (error) {
      console.error('Error loading stats from file:', error);
    }
    
    return null;
  }
  
  public getRecentVisitors(minutes: number = 60): VisitorLog[] {
    const logs: VisitorLog[] = [];
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    
    try {
      const logFile = this.getLogFileName();
      if (existsSync(logFile)) {
        const content = readFileSync(logFile, 'utf8');
        const lines = content.trim().split('\n');
        
        for (const line of lines) {
          try {
            const log = JSON.parse(line) as VisitorLog;
            if (new Date(log.timestamp) >= cutoffTime) {
              logs.push(log);
            }
          } catch (e) {
            // Skip invalid lines
          }
        }
      }
    } catch (error) {
      console.error('Error reading recent visitors:', error);
    }
    
    return logs;
  }
  
  // Cleanup old log files (older than 30 days)
  public cleanupOldLogs(daysToKeep: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    try {
      const files = readdirSync(this.logsDir);
      
      for (const file of files) {
        if (file.startsWith('visitor-')) {
          const match = file.match(/visitor-(?:log|stats)-(\d{4}-\d{2}-\d{2})\.json/);
          if (match) {
            const fileDate = new Date(match[1]);
            if (fileDate < cutoffDate) {
              unlinkSync(join(this.logsDir, file));
              console.log(`Deleted old log file: ${file}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error cleaning up old logs:', error);
    }
  }
}

// Export a singleton instance
// Create visitor logger instance with configuration from environment
const logDir = process.env['VISITOR_LOG_DIR'] || join(process.cwd(), 'logs');
export const visitorLogger = new VisitorLogger(logDir);