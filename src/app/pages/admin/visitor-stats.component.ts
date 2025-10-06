import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface VisitorLog {
  timestamp: string;
  ip: string;
  userAgent: string;
  method: string;
  url: string;
  referer?: string;
  country?: string;
  browser?: string;
  os?: string;
  device?: string;
  responseTime?: number;
  statusCode?: number;
}

interface DailyStats {
  date: string;
  totalVisits: number;
  uniqueVisitorCount: number;
  pageViews: { [key: string]: number };
  browsers: { [key: string]: number };
  operatingSystems: { [key: string]: number };
  countries: { [key: string]: number };
  topReferers: { [key: string]: number };
  averageResponseTime: number;
  errorCount: number;
}

@Component({
  selector: 'app-visitor-stats',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="visitor-stats-container">
      <h1>Visitor Analytics Dashboard</h1>
      
      <div class="stats-grid" *ngIf="todayStats">
        <div class="stat-card">
          <h3>Total Visits Today</h3>
          <p class="stat-value">{{ todayStats.totalVisits }}</p>
        </div>
        
        <div class="stat-card">
          <h3>Unique Visitors</h3>
          <p class="stat-value">{{ todayStats.uniqueVisitorCount }}</p>
        </div>
        
        <div class="stat-card">
          <h3>Average Response Time</h3>
          <p class="stat-value">{{ todayStats.averageResponseTime.toFixed(2) }}ms</p>
        </div>
        
        <div class="stat-card">
          <h3>Error Count</h3>
          <p class="stat-value error">{{ todayStats.errorCount }}</p>
        </div>
      </div>
      
      <div class="charts-section">
        <div class="chart-container">
          <h3>Top Pages</h3>
          <ul class="page-list">
            <li *ngFor="let page of getTopPages()">
              <span class="page-url">{{ page.url }}</span>
              <span class="page-count">{{ page.count }} visits</span>
            </li>
          </ul>
        </div>
        
        <div class="chart-container">
          <h3>Browser Distribution</h3>
          <div class="distribution-bars">
            <div *ngFor="let browser of getBrowserStats()" class="bar-item">
              <div class="bar-label">{{ browser.name }}</div>
              <div class="bar-track">
                <div class="bar-fill" [style.width.%]="browser.percentage">
                  {{ browser.percentage.toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Operating Systems</h3>
          <div class="distribution-bars">
            <div *ngFor="let os of getOSStats()" class="bar-item">
              <div class="bar-label">{{ os.name }}</div>
              <div class="bar-track">
                <div class="bar-fill" [style.width.%]="os.percentage">
                  {{ os.percentage.toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Countries</h3>
          <ul class="country-list" *ngIf="getCountryStats().length > 0">
            <li *ngFor="let country of getCountryStats()">
              <span class="country-code">{{ country.code }}</span>
              <span class="country-count">{{ country.count }} visits</span>
            </li>
          </ul>
          <p *ngIf="getCountryStats().length === 0" class="no-data">
            No country data available
          </p>
        </div>
      </div>
      
      <div class="recent-visitors">
        <h2>Recent Visitors (Last Hour)</h2>
        <div class="visitor-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Page</th>
                <th>Browser</th>
                <th>OS</th>
                <th>Device</th>
                <th>Response Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let visitor of recentVisitors">
                <td>{{ formatTime(visitor.timestamp) }}</td>
                <td>{{ visitor.url }}</td>
                <td>{{ visitor.browser || 'Unknown' }}</td>
                <td>{{ visitor.os || 'Unknown' }}</td>
                <td>{{ visitor.device || 'Unknown' }}</td>
                <td>{{ visitor.responseTime }}ms</td>
                <td [class.error-status]="visitor.statusCode && visitor.statusCode >= 400">{{ visitor.statusCode || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="actions">
        <button (click)="refreshData()" class="btn btn-primary">Refresh Data</button>
        <button (click)="cleanupOldLogs()" class="btn btn-secondary">Cleanup Old Logs</button>
      </div>
    </div>
  `,
  styles: [`
    .visitor-stats-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    
    h1 {
      color: #D04A02;
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }
    
    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      border-top: 3px solid #D04A02;
    }
    
    .stat-card h3 {
      color: #666;
      font-size: 0.9rem;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    
    .stat-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #333;
      margin: 0;
    }
    
    .stat-value.error {
      color: #F44336;
    }
    
    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .chart-container {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .chart-container h3 {
      color: #D04A02;
      margin-bottom: 1rem;
    }
    
    .page-list, .country-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .page-list li, .country-list li {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .page-url, .country-code {
      color: #333;
      font-weight: 500;
    }
    
    .page-count, .country-count {
      color: #666;
      font-size: 0.9rem;
    }
    
    .distribution-bars {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .bar-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .bar-label {
      min-width: 80px;
      font-size: 0.9rem;
      color: #666;
    }
    
    .bar-track {
      flex: 1;
      height: 24px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
    }
    
    .bar-fill {
      height: 100%;
      background: #D04A02;
      color: white;
      display: flex;
      align-items: center;
      padding: 0 8px;
      font-size: 0.8rem;
      font-weight: 500;
      transition: width 0.3s ease;
    }
    
    .recent-visitors {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }
    
    .recent-visitors h2 {
      color: #D04A02;
      margin-bottom: 1rem;
    }
    
    .visitor-table {
      overflow-x: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th {
      background: #f8f9fa;
      color: #666;
      text-align: left;
      padding: 0.75rem;
      font-weight: 600;
      border-bottom: 2px solid #e0e0e0;
    }
    
    td {
      padding: 0.75rem;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .error-status {
      color: #F44336;
      font-weight: 600;
    }
    
    .no-data {
      text-align: center;
      color: #999;
      font-style: italic;
    }
    
    .actions {
      text-align: center;
      margin-top: 2rem;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 0 0.5rem;
    }
    
    .btn-primary {
      background: #D04A02;
      color: white;
    }
    
    .btn-primary:hover {
      background: #B03902;
    }
    
    .btn-secondary {
      background: #666;
      color: white;
    }
    
    .btn-secondary:hover {
      background: #555;
    }
  `]
})
export class VisitorStatsComponent implements OnInit, OnDestroy {
  todayStats: DailyStats | null = null;
  recentVisitors: VisitorLog[] = [];
  private refreshSubscription?: Subscription;
  
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.loadData();
    
    // Auto-refresh every 30 seconds
    this.refreshSubscription = interval(30000).pipe(
      switchMap(() => this.http.get<DailyStats>('/api/visitor-stats'))
    ).subscribe(stats => {
      this.todayStats = stats;
    });
    
    // Also refresh recent visitors
    interval(15000).pipe(
      switchMap(() => this.http.get<VisitorLog[]>('/api/recent-visitors'))
    ).subscribe(visitors => {
      this.recentVisitors = visitors;
    });
  }
  
  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }
  
  loadData(): void {
    // Load today's stats
    this.http.get<DailyStats>('/api/visitor-stats').subscribe(
      stats => this.todayStats = stats,
      error => console.error('Failed to load visitor stats:', error)
    );
    
    // Load recent visitors
    this.http.get<VisitorLog[]>('/api/recent-visitors').subscribe(
      visitors => this.recentVisitors = visitors,
      error => console.error('Failed to load recent visitors:', error)
    );
  }
  
  refreshData(): void {
    this.loadData();
  }
  
  cleanupOldLogs(): void {
    if (confirm('This will delete logs older than 30 days. Continue?')) {
      this.http.post('/api/cleanup-logs', { daysToKeep: 30 }).subscribe(
        response => {
          console.log('Cleanup response:', response);
          alert('Old logs cleanup completed');
        },
        error => {
          console.error('Cleanup failed:', error);
          alert('Failed to cleanup logs');
        }
      );
    }
  }
  
  getTopPages(): { url: string; count: number }[] {
    if (!this.todayStats?.pageViews) return [];
    
    return Object.entries(this.todayStats.pageViews)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
  
  getBrowserStats(): { name: string; count: number; percentage: number }[] {
    if (!this.todayStats?.browsers) return [];
    
    const total = this.todayStats.totalVisits || 1;
    return Object.entries(this.todayStats.browsers)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / total) * 100
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  getOSStats(): { name: string; count: number; percentage: number }[] {
    if (!this.todayStats?.operatingSystems) return [];
    
    const total = this.todayStats.totalVisits || 1;
    return Object.entries(this.todayStats.operatingSystems)
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / total) * 100
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  getCountryStats(): { code: string; count: number }[] {
    if (!this.todayStats?.countries) return [];
    
    return Object.entries(this.todayStats.countries)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
  
  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  }
}