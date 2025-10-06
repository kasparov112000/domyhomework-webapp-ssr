import axios from 'axios';
import { VisitorLog } from '../middleware/visitor-logger';

export interface AuditLogEntry {
  entityName: string;
  entityType: string;
  details: string;
  dateTime: Date;
  data?: any;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
}

export class AuditLogService {
  private static instance: AuditLogService;
  private apiUrl: string;
  private batchQueue: AuditLogEntry[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private readonly batchSize = 10;
  private readonly batchDelay = 5000; // 5 seconds

  private constructor() {
    // Determine the appropriate orchestrator URL based on environment
    this.apiUrl = this.getOrchestratorUrl();
    
    // Log the configured URL for debugging
    console.log('[AuditLogService] Configured with URL:', this.apiUrl);
  }

  /**
   * Determines the appropriate orchestrator URL based on the environment
   */
  private getOrchestratorUrl(): string {
    // If explicitly set in environment, use that
    if (process.env['ORCHESTRATOR_URL']) {
      return process.env['ORCHESTRATOR_URL'];
    }

    // Check if we're running in localhost/development
    const isLocalhost = this.isLocalEnvironment();
    
    if (isLocalhost) {
      // Use local orchestrator port (typically 8080)
      const localOrchestratorPort = process.env['LOCAL_ORCHESTRATOR_PORT'] || '8080';
      return `http://localhost:${localOrchestratorPort}`;
    }
    
    // Default to production URL
    return 'https://orchestrator.learnbytesting.ai';
  }

  /**
   * Detects if the application is running in a local environment
   */
  private isLocalEnvironment(): boolean {
    // Check various indicators of local development
    const indicators = [
      process.env['NODE_ENV'] === 'development',
      process.env['ENV_NAME'] === 'LOCAL',
      process.env['IS_LOCAL'] === 'true',
      // Check if the SSR app is running on localhost ports
      process.env['PORT'] === '4000' || process.env['PORT'] === '4200',
      // Check hostname if available
      typeof process !== 'undefined' && process.env['HOSTNAME']?.includes('localhost'),
      // Default to true if no production indicators
      !process.env['NODE_ENV'] || process.env['NODE_ENV'] === ''
    ];
    
    return indicators.some(indicator => indicator === true);
  }

  public static getInstance(): AuditLogService {
    if (!AuditLogService.instance) {
      AuditLogService.instance = new AuditLogService();
    }
    return AuditLogService.instance;
  }

  /**
   * Log a visitor to the audit logs system
   */
  public async logVisitor(visitor: VisitorLog): Promise<void> {
    // Check if sending to audit API is enabled
    if (process.env['SEND_TO_AUDIT_API'] === 'false') {
      console.log('[AuditLogService] API sending is disabled by SEND_TO_AUDIT_API=false');
      return;
    }
    
    console.log('[AuditLogService] Processing visitor log...');
    const auditEntry: AuditLogEntry = {
      entityName: 'visitor-logs',
      entityType: 'landing-page-visit',
      details: `${visitor.method} ${visitor.path} - ${visitor.userAgent}`,
      dateTime: new Date(),
      data: {
        ...visitor,
        source: 'webapp-ssr',
        environment: this.isLocalEnvironment() ? 'local' : 'production',
        srrPort: process.env['PORT'] || '4000'
      },
      ipAddress: visitor.ip
    };

    // Add to batch queue
    this.batchQueue.push(auditEntry);
    console.log(`[AuditLogService] Added to batch queue. Queue size: ${this.batchQueue.length}/${this.batchSize}`);

    // Process batch if size reached
    if (this.batchQueue.length >= this.batchSize) {
      console.log('[AuditLogService] Batch size reached, processing immediately...');
      await this.processBatch();
    } else {
      // Schedule batch processing if not already scheduled
      if (!this.batchTimer) {
        console.log(`[AuditLogService] Scheduling batch processing in ${this.batchDelay}ms...`);
        this.batchTimer = setTimeout(() => this.processBatch(), this.batchDelay);
      }
    }
  }

  /**
   * Process the batch of audit logs
   */
  private async processBatch(): Promise<void> {
    console.log('[AuditLogService] Processing batch...');
    
    // Clear timer
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // Get current batch and clear queue
    const batch = [...this.batchQueue];
    this.batchQueue = [];

    if (batch.length === 0) {
      console.log('[AuditLogService] Batch is empty, nothing to process');
      return;
    }
    
    console.log(`[AuditLogService] Processing ${batch.length} entries...`);

    try {
      // Send batch to audit logs API
      for (const entry of batch) {
        await this.sendToAuditLogs(entry);
      }
    } catch (error) {
      console.error('[AuditLogService] Error processing batch:', error);
      // Re-queue failed entries (with a limit to prevent infinite loops)
      if (this.batchQueue.length < this.batchSize * 2) {
        this.batchQueue.unshift(...batch);
      }
    }
  }

  /**
   * Send audit log entry to the API
   */
  private async sendToAuditLogs(entry: AuditLogEntry): Promise<void> {
    const url = `${this.apiUrl}/api/auditLogs`;
    
    try {
      console.log('[AuditLogService] Sending to URL:', url);
      
      const response = await axios.post(
        url,
        entry,
        {
          headers: {
            'Content-Type': 'application/json',
            // Add API key if required
            'X-API-Key': process.env['AUDIT_API_KEY'] || ''
          },
          timeout: 5000 // 5 second timeout
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Audit log API returned status ${response.status}`);
      }
      
      console.log('[AuditLogService] Successfully sent audit log');
    } catch (error: any) {
      // Log detailed error information
      if (error.response) {
        console.error('[AuditLogService] API Error Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: typeof error.response.data === 'string' ? error.response.data.substring(0, 200) : error.response.data,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        });
        
        // If we get a 404 with HTML, it might be a proxy issue
        if (error.response.status === 404 && 
            typeof error.response.data === 'string' && 
            error.response.data.includes('<!DOCTYPE')) {
          console.error('[AuditLogService] Received HTML 404 - possible proxy/routing issue');
          console.error('[AuditLogService] Make sure the orchestrator URL is correct and accessible');
        }
      } else if (error.request) {
        console.error('[AuditLogService] No response received:', error.message);
      } else {
        console.error('[AuditLogService] Error setting up request:', error.message);
      }
    }
  }

  /**
   * Get visitor statistics from audit logs
   */
  public async getVisitorStats(days: number = 7): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/auditLogs`,
        {
          params: {
            entityName: 'visitor-logs',
            $sort: '-dateTime',
            $limit: 1000,
            dateTime: {
              $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
            }
          },
          headers: {
            'X-API-Key': process.env['AUDIT_API_KEY'] || ''
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('[AuditLogService] Error fetching stats:', error);
      return null;
    }
  }

  /**
   * Flush any pending logs before shutdown
   */
  public async flush(): Promise<void> {
    if (this.batchQueue.length > 0) {
      await this.processBatch();
    }
  }
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    await AuditLogService.getInstance().flush();
  });

  process.on('SIGINT', async () => {
    await AuditLogService.getInstance().flush();
  });
}