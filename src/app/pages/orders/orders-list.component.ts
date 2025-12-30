import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridReadyEvent,
  GridApi,
  IDatasource,
  IGetRowsParams,
  ModuleRegistry,
  ClientSideRowModelModule,
  InfiniteRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule
} from 'ag-grid-community';
import { Order, OrderStatus, PaymentStatus } from '../../models/order.model';

// Register AG Grid modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  InfiniteRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule
]);

interface OrdersResponse {
  success: boolean;
  result?: {
    orders: Order[];
    total: number;
    page: number;
    pageSize: number;
  };
  error?: string;
}

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, AgGridAngular],
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit, OnDestroy {
  private isBrowser: boolean;
  private baseUrl: string = '';
  private gridApi!: GridApi;
  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  // View state
  viewType: 'grid' | 'tile' = 'grid';
  isMobile = false;
  isLoading = false;
  totalRecords = 0;
  today = new Date();

  // Search and filters
  searchTerm = '';
  statusFilter: OrderStatus | '' = '';
  paymentStatusFilter: PaymentStatus | '' = '';
  dateFrom: string = '';
  dateTo: string = '';

  // Tile view pagination
  tileOrders: Order[] = [];
  tilePage = 1;
  tilePageSize = 10;
  tileTotalPages = 1;

  // Expose isBrowser to template
  get isBrowserView(): boolean {
    return this.isBrowser;
  }

  // AG Grid configuration
  columnDefs: ColDef[] = [];
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100
  };
  rowModelType: 'infinite' = 'infinite';
  cacheBlockSize = 20;
  paginationPageSize = 20;
  rowHeight = 60;
  headerHeight = 50;

  // Status options for dropdown
  statusOptions: { value: OrderStatus | ''; label: string }[] = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  paymentStatusOptions: { value: PaymentStatus | ''; label: string }[] = [
    { value: '', label: 'All Payment Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.baseUrl = this.getApiBaseUrl();
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.checkScreenSize();
      this.setupColumnDefs();
      this.setupSearch();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.searchSubject.complete();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private getApiBaseUrl(): string {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080/api/orders';
    }
    return 'https://orchestrator.learnbytesting.ai/api/orders';
  }

  private checkScreenSize(): void {
    if (!this.isBrowser) return;
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile && this.viewType === 'grid') {
      this.viewType = 'tile';
      this.loadTileData();
    }
  }

  private setupSearch(): void {
    const sub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.refreshData();
    });
    this.subscriptions.push(sub);
  }

  private setupColumnDefs(): void {
    this.columnDefs = [
      {
        headerName: 'Order ID',
        field: '_id',
        width: 120,
        cellRenderer: (params: any) => {
          if (!params.value) return '';
          const shortId = params.value.slice(-8).toUpperCase();
          return `<span class="order-id">#${shortId}</span>`;
        }
      },
      {
        headerName: 'Date',
        field: 'createdAt',
        width: 130,
        cellRenderer: (params: any) => {
          if (!params.value) return '';
          const date = new Date(params.value);
          return `<div class="date-cell">
            <div class="date">${date.toLocaleDateString()}</div>
            <div class="time">${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>`;
        }
      },
      {
        headerName: 'Customer',
        field: 'customerEmail',
        width: 180,
        cellRenderer: (params: any) => {
          const email = params.value || 'N/A';
          const name = params.data?.customerName || '';
          return `<div class="customer-cell">
            <div class="customer-name">${name || email.split('@')[0]}</div>
            <div class="customer-email">${email}</div>
          </div>`;
        }
      },
      {
        headerName: 'Title',
        field: 'title',
        flex: 1,
        minWidth: 200,
        cellRenderer: (params: any) => {
          const title = params.value || 'Untitled';
          const type = params.data?.serviceType || '';
          return `<div class="title-cell">
            <div class="title">${title}</div>
            <div class="service-type">${this.formatServiceType(type)}</div>
          </div>`;
        }
      },
      {
        headerName: 'Pages',
        field: 'numberOfPages',
        width: 80,
        cellRenderer: (params: any) => {
          return `<span class="pages-badge">${params.value || 0}</span>`;
        }
      },
      {
        headerName: 'Deadline',
        field: 'deadline',
        width: 130,
        cellRenderer: (params: any) => {
          if (!params.value) return '';
          const deadline = new Date(params.value);
          const now = new Date();
          const isOverdue = deadline < now;
          const isUrgent = !isOverdue && (deadline.getTime() - now.getTime()) < 24 * 60 * 60 * 1000;
          const className = isOverdue ? 'overdue' : (isUrgent ? 'urgent' : '');
          return `<span class="deadline ${className}">${deadline.toLocaleDateString()}</span>`;
        }
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 130,
        cellRenderer: (params: any) => {
          const status = params.value || 'pending';
          return `<span class="status-badge status-${status}">${this.formatStatus(status)}</span>`;
        }
      },
      {
        headerName: 'Payment',
        field: 'paymentStatus',
        width: 120,
        cellRenderer: (params: any) => {
          const status = params.value || 'pending';
          return `<span class="payment-badge payment-${status}">${this.formatPaymentStatus(status)}</span>`;
        }
      },
      {
        headerName: 'Total',
        field: 'pricing.finalPrice',
        width: 100,
        cellRenderer: (params: any) => {
          const price = params.data?.pricing?.finalPrice || 0;
          return `<span class="price">$${price.toFixed(2)}</span>`;
        }
      },
      {
        headerName: 'Actions',
        field: 'actions',
        width: 100,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          return `<div class="action-buttons">
            <button class="btn-view" title="View Details">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>`;
        }
      }
    ];
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.setDatasource();
  }

  private setDatasource(): void {
    const datasource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        this.isLoading = true;
        const page = Math.floor(params.startRow / this.cacheBlockSize) + 1;

        this.fetchOrders(page, this.cacheBlockSize).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success && response.result) {
              this.totalRecords = response.result.total;
              const lastRow = response.result.total <= params.endRow ? response.result.total : -1;
              params.successCallback(response.result.orders, lastRow);
            } else {
              params.failCallback();
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Error loading orders:', err);
            params.failCallback();
          }
        });
      }
    };

    this.gridApi.updateGridOptions({ datasource });
  }

  private fetchOrders(page: number, pageSize: number) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (this.searchTerm) {
      params = params.set('search', this.searchTerm);
    }
    if (this.statusFilter) {
      params = params.set('status', this.statusFilter);
    }
    if (this.paymentStatusFilter) {
      params = params.set('paymentStatus', this.paymentStatusFilter);
    }
    if (this.dateFrom) {
      params = params.set('fromDate', new Date(this.dateFrom).toISOString());
    }
    if (this.dateTo) {
      params = params.set('toDate', new Date(this.dateTo).toISOString());
    }

    return this.http.get<OrdersResponse>(this.baseUrl, { params });
  }

  // Tile view methods
  loadTileData(): void {
    this.isLoading = true;
    this.fetchOrders(this.tilePage, this.tilePageSize).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.result) {
          this.tileOrders = response.result.orders;
          this.totalRecords = response.result.total;
          this.tileTotalPages = Math.ceil(response.result.total / this.tilePageSize);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading orders:', err);
      }
    });
  }

  goToTilePage(page: number): void {
    if (page >= 1 && page <= this.tileTotalPages) {
      this.tilePage = page;
      this.loadTileData();
    }
  }

  // Event handlers
  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.refreshData();
  }

  refreshData(): void {
    if (this.viewType === 'grid' && this.gridApi) {
      this.gridApi.refreshInfiniteCache();
    } else {
      this.tilePage = 1;
      this.loadTileData();
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.paymentStatusFilter = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.refreshData();
  }

  toggleView(view: 'grid' | 'tile'): void {
    this.viewType = view;
    if (view === 'tile') {
      this.loadTileData();
    }
  }

  viewOrder(order: Order): void {
    console.log('View order:', order._id);
    // TODO: Navigate to order details page
  }

  exportToCsv(): void {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({
        fileName: `orders-${new Date().toISOString().split('T')[0]}.csv`
      });
    }
  }

  // Formatters
  formatStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'in_progress': 'In Progress',
      'review': 'Under Review',
      'completed': 'Completed',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded'
    };
    return statusMap[status] || status;
  }

  formatPaymentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Pending',
      'processing': 'Processing',
      'paid': 'Paid',
      'failed': 'Failed',
      'refunded': 'Refunded',
      'partial_refund': 'Partial Refund'
    };
    return statusMap[status] || status;
  }

  formatServiceType(type: string): string {
    const typeMap: Record<string, string> = {
      'writing': 'Writing',
      'editing': 'Editing',
      'proofreading': 'Proofreading',
      'other': 'Other'
    };
    return typeMap[type] || type;
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  }

  formatPrice(price: number): string {
    return `$${(price || 0).toFixed(2)}`;
  }

  isOverdue(deadline: string | Date | undefined): boolean {
    if (!deadline) return false;
    return new Date(deadline) < this.today;
  }
}
