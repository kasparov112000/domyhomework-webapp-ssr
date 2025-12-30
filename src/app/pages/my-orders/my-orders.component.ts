import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';

interface Order {
  _id: string;
  orderNumber?: string;
  // Dates - API may use either format
  createdAt?: string;
  createdDate?: string;
  // Status - can be number (from DB) or string
  status?: number | string;
  isDraft?: boolean;
  currentStep?: number;
  // Key Details fields (from PaperSubmission model)
  serviceType?: string;
  paperType?: string;
  subjectArea?: string;
  academicLevel?: string;
  numberOfPages?: number;
  deadline?: string;
  deadlineUrgency?: string;
  // Instructions fields
  title?: string;
  instructions?: string;
  citationStyle?: string;
  numberOfSources?: number;
  // Pricing
  pricingBreakdown?: {
    finalPrice: number;
    pricePerPage?: number;
    basePrice?: number;
  };
  estimatedPrice?: number;
}

interface OrdersResponse {
  success: boolean;
  result?: Order[];
  error?: string;
}

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="my-orders-page">
      <div class="container">
        <!-- Header -->
        <div class="page-header">
          <h1>My Orders</h1>
          <p>View and track your paper submissions</p>
          <a routerLink="/order" [queryParams]="{new: 'true'}" class="btn-new-order">
            <span class="material-icons">add</span>
            New Order
          </a>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        }

        <!-- Error State -->
        @if (error()) {
          <div class="error-state">
            <span class="material-icons">error_outline</span>
            <p>{{ error() }}</p>
            <button class="btn-retry" (click)="loadOrders()">Try Again</button>
          </div>
        }

        <!-- Empty State -->
        @if (!isLoading() && !error() && orders().length === 0) {
          <div class="empty-state">
            <span class="material-icons">inbox</span>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders. Start your first order now!</p>
            <a routerLink="/order" [queryParams]="{new: 'true'}" class="btn-primary">Place Your First Order</a>
          </div>
        }

        <!-- Orders List -->
        @if (!isLoading() && !error() && orders().length > 0) {
          <div class="orders-summary">
            <span>{{ orders().length }} order{{ orders().length !== 1 ? 's' : '' }} found</span>
          </div>

          <div class="orders-list">
            @for (order of orders(); track order._id) {
              <div class="order-card">
                <div class="order-header">
                  <div class="order-id">
                    <span class="label">Order #</span>
                    <span class="value">{{ order.orderNumber || order._id.slice(-8).toUpperCase() }}</span>
                  </div>
                  <div class="order-status" [class]="getStatusClass(order)">
                    {{ formatStatus(order) }}
                  </div>
                </div>

                <div class="order-body">
                  <div class="order-details">
                    <div class="detail-item">
                      <span class="material-icons">description</span>
                      <div>
                        <span class="label">Paper Type</span>
                        <span class="value">{{ formatPaperType(order.paperType) }}</span>
                      </div>
                    </div>
                    <div class="detail-item">
                      <span class="material-icons">subject</span>
                      <div>
                        <span class="label">Subject</span>
                        <span class="value">{{ order.subjectArea || 'Not specified' }}</span>
                      </div>
                    </div>
                    <div class="detail-item">
                      <span class="material-icons">school</span>
                      <div>
                        <span class="label">Level</span>
                        <span class="value">{{ formatAcademicLevel(order.academicLevel) }}</span>
                      </div>
                    </div>
                    <div class="detail-item">
                      <span class="material-icons">article</span>
                      <div>
                        <span class="label">Pages</span>
                        <span class="value">{{ order.numberOfPages || 1 }}</span>
                      </div>
                    </div>
                  </div>

                  @if (order.title) {
                    <div class="order-topic">
                      <span class="material-icons">edit_note</span>
                      <span>{{ order.title }}</span>
                    </div>
                  }
                </div>

                <div class="order-footer">
                  <div class="order-meta">
                    <div class="meta-item">
                      <span class="material-icons">calendar_today</span>
                      <span>Ordered: {{ formatDate(order.createdDate || order.createdAt) }}</span>
                    </div>
                    @if (order.deadline) {
                      <div class="meta-item deadline">
                        <span class="material-icons">schedule</span>
                        <span>Due: {{ formatDate(order.deadline) }}</span>
                      </div>
                    }
                  </div>
                  <div class="order-price">
                    <span class="price-label">Total</span>
                    <span class="price-value">{{ formatPrice(order.pricingBreakdown?.finalPrice || order.estimatedPrice || 0) }}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="order-actions">
                  @if (order.isDraft) {
                    <a [routerLink]="['/order', order._id]" class="btn-continue">
                      <span class="material-icons">edit</span>
                      Continue Order
                    </a>
                  } @else {
                    <a [routerLink]="['/order', order._id]" class="btn-view">
                      <span class="material-icons">visibility</span>
                      View Details
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .my-orders-page {
      min-height: calc(100vh - 200px);
      background: #f8f9fa;
      padding: 2rem 0 4rem;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Header */
    .page-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      color: #333;
      margin: 0;
    }

    .page-header p {
      flex: 1 1 100%;
      color: #666;
      margin: 0;
    }

    .btn-new-order {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
      padding: 0.75rem 1.25rem;
      background: #D04A02;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-new-order:hover {
      background: #B03902;
      transform: translateY(-1px);
    }

    .btn-new-order .material-icons {
      font-size: 20px;
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e0e0e0;
      border-top-color: #D04A02;
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-state p {
      color: #666;
    }

    /* Error State */
    .error-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .error-state .material-icons {
      font-size: 48px;
      color: #ef4444;
      margin-bottom: 1rem;
    }

    .error-state p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .btn-retry {
      padding: 0.75rem 1.5rem;
      background: #D04A02;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .empty-state .material-icons {
      font-size: 64px;
      color: #ccc;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #333;
      margin: 0 0 0.5rem;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .btn-primary {
      display: inline-block;
      padding: 0.875rem 2rem;
      background: #D04A02;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #B03902;
    }

    /* Orders Summary */
    .orders-summary {
      color: #666;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    /* Orders List */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    /* Order Card */
    .order-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      overflow: hidden;
      transition: box-shadow 0.2s;
    }

    .order-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: #f8f9fa;
      border-bottom: 1px solid #eee;
    }

    .order-id .label {
      font-size: 0.8rem;
      color: #888;
      display: block;
    }

    .order-id .value {
      font-weight: 700;
      color: #333;
      font-family: monospace;
    }

    .order-status {
      padding: 0.375rem 0.875rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .order-status.draft {
      background: #e0e0e0;
      color: #666;
    }

    .order-status.pending {
      background: #fff3cd;
      color: #856404;
    }

    .order-status.confirmed {
      background: #d4edda;
      color: #155724;
    }

    .order-status.in_progress {
      background: #cce5ff;
      color: #004085;
    }

    .order-status.completed {
      background: #d4edda;
      color: #155724;
    }

    .order-status.delivered {
      background: #d4edda;
      color: #155724;
    }

    .order-status.revision {
      background: #fff3cd;
      color: #856404;
    }

    .order-status.cancelled {
      background: #f8d7da;
      color: #721c24;
    }

    .order-body {
      padding: 1.25rem;
    }

    .order-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .detail-item .material-icons {
      font-size: 20px;
      color: #D04A02;
      margin-top: 2px;
    }

    .detail-item .label {
      display: block;
      font-size: 0.75rem;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-item .value {
      display: block;
      color: #333;
      font-weight: 500;
    }

    .order-topic {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
      color: #555;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .order-topic .material-icons {
      font-size: 20px;
      color: #D04A02;
      flex-shrink: 0;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: #fafafa;
      border-top: 1px solid #eee;
    }

    .order-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.85rem;
      color: #666;
    }

    .meta-item .material-icons {
      font-size: 16px;
    }

    .meta-item.deadline {
      color: #D04A02;
      font-weight: 500;
    }

    .order-price {
      text-align: right;
    }

    .price-label {
      display: block;
      font-size: 0.75rem;
      color: #888;
      text-transform: uppercase;
    }

    .price-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #D04A02;
    }

    .order-actions {
      display: flex;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-top: 1px solid #eee;
    }

    .btn-view, .btn-continue {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-view {
      background: #f0f0f0;
      color: #333;
    }

    .btn-view:hover {
      background: #e0e0e0;
    }

    .btn-continue {
      background: #D04A02;
      color: white;
    }

    .btn-continue:hover {
      background: #B03902;
    }

    .btn-view .material-icons,
    .btn-continue .material-icons {
      font-size: 18px;
    }

    /* Material Icons */
    .material-icons {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .btn-new-order {
        margin-left: 0;
        width: 100%;
        justify-content: center;
      }

      .order-details {
        grid-template-columns: 1fr 1fr;
      }

      .order-footer {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .order-price {
        text-align: left;
      }

      .order-actions {
        flex-direction: column;
      }

      .btn-view, .btn-continue {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .order-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MyOrdersComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  orders = signal<Order[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const user = this.authService.currentUser();
    if (!user?._id) {
      this.error.set('Please log in to view your orders.');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const apiUrl = this.getApiUrl();
    this.http.get<OrdersResponse>(`${apiUrl}/user/${user._id}`).subscribe({
      next: (response) => {
        console.log('[MyOrdersComponent] API response:', response);
        if (response.success && response.result) {
          // Sort by date, newest first (handle both createdDate and createdAt)
          const sorted = response.result.sort((a, b) => {
            const dateA = new Date(a.createdDate || a.createdAt || 0).getTime();
            const dateB = new Date(b.createdDate || b.createdAt || 0).getTime();
            return dateB - dateA;
          });
          this.orders.set(sorted);
        } else {
          this.orders.set([]);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('[MyOrdersComponent] Error loading orders:', err);
        this.error.set('Failed to load orders. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  private getApiUrl(): string {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080/api/projects/submissions';
    }
    return 'https://orchestrator.learnbytesting.ai/api/projects/submissions';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatStatus(order: Order): string {
    if (order.isDraft) return 'Draft';

    // Handle numeric status
    if (typeof order.status === 'number') {
      const numericStatusMap: Record<number, string> = {
        0: 'Draft',
        1: 'Pending',
        2: 'Confirmed',
        3: 'In Progress',
        4: 'Completed',
        5: 'Delivered',
        6: 'Revision',
        7: 'Cancelled'
      };
      return numericStatusMap[order.status] ?? 'Pending';
    }

    // Handle string status
    if (typeof order.status === 'string') {
      const statusMap: Record<string, string> = {
        'draft': 'Draft',
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'delivered': 'Delivered',
        'revision': 'Revision',
        'cancelled': 'Cancelled'
      };
      return statusMap[order.status] || order.status;
    }

    // Derive status from currentStep if no explicit status
    if (order.currentStep !== undefined && order.currentStep < 4) {
      return 'Draft';
    }
    return 'Pending';
  }

  getStatusClass(order: Order): string {
    if (order.isDraft) return 'draft';

    // Handle numeric status
    if (typeof order.status === 'number') {
      const numericClassMap: Record<number, string> = {
        0: 'draft',
        1: 'pending',
        2: 'confirmed',
        3: 'in-progress',
        4: 'completed',
        5: 'delivered',
        6: 'revision',
        7: 'cancelled'
      };
      return numericClassMap[order.status] ?? 'pending';
    }

    // Handle string status
    if (typeof order.status === 'string') {
      return order.status.replace('_', '-');
    }

    if (order.currentStep !== undefined && order.currentStep < 4) return 'draft';
    return 'pending';
  }

  formatAcademicLevel(level?: string): string {
    if (!level) return 'Not specified';
    const levelMap: Record<string, string> = {
      'highschool': 'High School',
      'undergraduate': 'Undergraduate',
      'masters': "Master's",
      'phd': 'PhD'
    };
    return levelMap[level] || level;
  }

  formatPaperType(paperType?: string): string {
    if (!paperType) return 'Not specified';
    const typeMap: Record<string, string> = {
      'essay': 'Essay',
      'research_paper': 'Research Paper',
      'thesis': 'Thesis',
      'dissertation': 'Dissertation',
      'report': 'Report',
      'case_study': 'Case Study',
      'term_paper': 'Term Paper',
      'other': 'Other'
    };
    return typeMap[paperType] || paperType;
  }
}
