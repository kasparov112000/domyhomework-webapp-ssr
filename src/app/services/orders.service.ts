import { Injectable, PLATFORM_ID, Inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  OrderFilters,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  AssignExpertRequest,
  DeliverOrderRequest,
  RequestRevisionRequest,
  OrderListResponse
} from '../models/order.model';
import { ApiResponse } from '../models/paper-submission.model';

/**
 * OrdersService - Handles order operations
 * Manages finalized orders, payments, assignments, and delivery
 */
@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private isBrowser: boolean;
  private baseUrl: string;

  // Reactive state using signals
  private _currentOrder = signal<Order | null>(null);
  private _orders = signal<Order[]>([]);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Public computed signals
  readonly currentOrder = computed(() => this._currentOrder());
  readonly orders = computed(() => this._orders());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());

  // Computed order counts by status
  readonly pendingOrders = computed(() =>
    this._orders().filter(o => o.status === 'pending')
  );
  readonly inProgressOrders = computed(() =>
    this._orders().filter(o => o.status === 'in_progress')
  );
  readonly completedOrders = computed(() =>
    this._orders().filter(o => o.status === 'completed')
  );

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.baseUrl = this.getApiBaseUrl();
  }

  /**
   * Determine the API base URL based on environment
   */
  private getApiBaseUrl(): string {
    if (!this.isBrowser) {
      return '';
    }

    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080/api/orders';
    } else if (hostname.includes('domyhomework')) {
      return 'https://orchestrator.learnbytesting.ai/api/orders';
    } else {
      return 'https://orchestrator.learnbytesting.ai/api/orders';
    }
  }

  // ===== ORDER CRUD OPERATIONS =====

  /**
   * Create a new order from a paper submission
   */
  createOrder(request: CreateOrderRequest): Observable<ApiResponse<Order>> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<ApiResponse<Order>>(
      this.baseUrl,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._currentOrder.set(response.result);
          // Add to orders list
          this._orders.update(orders => [response.result!, ...orders]);
          console.log('[OrdersService] Order created:', response.result._id);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.message);
        console.error('[OrdersService] Error creating order:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get an order by ID
   */
  getOrder(id: string): Observable<ApiResponse<Order>> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.get<ApiResponse<Order>>(
      `${this.baseUrl}/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._currentOrder.set(response.result);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.message);
        console.error('[OrdersService] Error fetching order:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all orders (with optional filters)
   */
  getOrders(filters?: OrderFilters, page = 1, pageSize = 20): Observable<ApiResponse<OrderListResponse>> {
    this._isLoading.set(true);
    this._error.set(null);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.paymentStatus) params = params.set('paymentStatus', filters.paymentStatus);
      if (filters.customerId) params = params.set('customerId', filters.customerId);
      if (filters.assignedExpertId) params = params.set('assignedExpertId', filters.assignedExpertId);
      if (filters.fromDate) params = params.set('fromDate', filters.fromDate.toISOString());
      if (filters.toDate) params = params.set('toDate', filters.toDate.toISOString());
      if (filters.searchTerm) params = params.set('search', filters.searchTerm);
    }

    return this.http.get<ApiResponse<OrderListResponse>>(
      this.baseUrl,
      { headers: this.getHeaders(), params }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._orders.set(response.result.orders);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.message);
        console.error('[OrdersService] Error fetching orders:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get orders for a specific customer
   */
  getCustomerOrders(customerId: string): Observable<ApiResponse<Order[]>> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.get<ApiResponse<Order[]>>(
      `${this.baseUrl}/customer/${customerId}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._orders.set(response.result);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.message);
        console.error('[OrdersService] Error fetching customer orders:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get orders by status
   */
  getOrdersByStatus(status: OrderStatus): Observable<ApiResponse<Order[]>> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.get<ApiResponse<Order[]>>(
      `${this.baseUrl}/status/${status}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._orders.set(response.result);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.message);
        console.error('[OrdersService] Error fetching orders by status:', error);
        return throwError(() => error);
      })
    );
  }

  // ===== STATUS MANAGEMENT =====

  /**
   * Update order status
   */
  updateOrderStatus(id: string, request: UpdateOrderStatusRequest): Observable<ApiResponse<Order>> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.put<ApiResponse<Order>>(
      `${this.baseUrl}/${id}/status`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._currentOrder.set(response.result);
          this.updateOrderInList(response.result);
          console.log('[OrdersService] Order status updated:', id, request.status);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.message);
        console.error('[OrdersService] Error updating order status:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cancel an order
   */
  cancelOrder(id: string, reason?: string): Observable<ApiResponse<Order>> {
    return this.updateOrderStatus(id, { status: 'cancelled', notes: reason });
  }

  // ===== ASSIGNMENT =====

  /**
   * Assign an expert to an order
   */
  assignExpert(id: string, request: AssignExpertRequest): Observable<ApiResponse<Order>> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.put<ApiResponse<Order>>(
      `${this.baseUrl}/${id}/assign`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._currentOrder.set(response.result);
          this.updateOrderInList(response.result);
          console.log('[OrdersService] Expert assigned:', id, request.expertName);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.message);
        console.error('[OrdersService] Error assigning expert:', error);
        return throwError(() => error);
      })
    );
  }

  // ===== DELIVERY =====

  /**
   * Mark order as delivered
   */
  deliverOrder(id: string, request: DeliverOrderRequest): Observable<ApiResponse<Order>> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.put<ApiResponse<Order>>(
      `${this.baseUrl}/${id}/deliver`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._currentOrder.set(response.result);
          this.updateOrderInList(response.result);
          console.log('[OrdersService] Order delivered:', id);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.message);
        console.error('[OrdersService] Error delivering order:', error);
        return throwError(() => error);
      })
    );
  }

  // ===== REVISIONS =====

  /**
   * Request a revision for an order
   */
  requestRevision(id: string, request: RequestRevisionRequest): Observable<ApiResponse<Order>> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.http.post<ApiResponse<Order>>(
      `${this.baseUrl}/${id}/revision`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._currentOrder.set(response.result);
          this.updateOrderInList(response.result);
          console.log('[OrdersService] Revision requested:', id);
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        this._error.set(error.message);
        console.error('[OrdersService] Error requesting revision:', error);
        return throwError(() => error);
      })
    );
  }

  // ===== HELPER METHODS =====

  /**
   * Update an order in the orders list
   */
  private updateOrderInList(updatedOrder: Order): void {
    this._orders.update(orders =>
      orders.map(order =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  }

  /**
   * Get HTTP headers
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Clear current order
   */
  clearCurrentOrder(): void {
    this._currentOrder.set(null);
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Refresh orders list
   */
  refreshOrders(filters?: OrderFilters): Observable<ApiResponse<OrderListResponse>> {
    return this.getOrders(filters);
  }
}
