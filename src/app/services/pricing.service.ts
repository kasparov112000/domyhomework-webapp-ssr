import { Injectable, PLATFORM_ID, Inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, map, shareReplay } from 'rxjs/operators';
import {
  PricingConfig,
  PricingBreakdown,
  ApiResponse,
  PromoValidationResponse,
  PriceCalculationRequest,
  AcademicLevel,
  ServiceType,
  DeadlineUrgency,
  ExtraItem,
  FreeInclude,
  SubjectArea
} from '../models/paper-submission.model';

/**
 * PricingService - Handles pricing configuration and calculations
 * Provides real-time price updates based on user selections
 */
@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private isBrowser: boolean;
  private baseUrl: string;

  // Cache for pricing config
  private pricingConfig$: Observable<PricingConfig> | null = null;

  // Reactive state using signals
  private _config = signal<PricingConfig | null>(null);
  private _currentBreakdown = signal<PricingBreakdown | null>(null);
  private _isLoading = signal<boolean>(false);
  private _appliedPromoCode = signal<string | null>(null);
  private _promoDiscount = signal<number>(0);
  private _promoType = signal<'percentage' | 'fixed' | null>(null);

  // Public computed signals
  readonly config = computed(() => this._config());
  readonly currentBreakdown = computed(() => this._currentBreakdown());
  readonly isLoading = computed(() => this._isLoading());
  readonly appliedPromoCode = computed(() => this._appliedPromoCode());
  readonly promoDiscount = computed(() => this._promoDiscount());

  // Default subject areas as fallback
  private readonly defaultSubjectAreas: SubjectArea[] = [
    { id: 'business', name: 'Business & Management', active: true },
    { id: 'computer_science', name: 'Computer Science & IT', active: true },
    { id: 'economics', name: 'Economics', active: true },
    { id: 'education', name: 'Education', active: true },
    { id: 'engineering', name: 'Engineering', active: true },
    { id: 'english', name: 'English & Literature', active: true },
    { id: 'healthcare', name: 'Healthcare & Nursing', active: true },
    { id: 'history', name: 'History', active: true },
    { id: 'law', name: 'Law', active: true },
    { id: 'marketing', name: 'Marketing', active: true },
    { id: 'mathematics', name: 'Mathematics', active: true },
    { id: 'philosophy', name: 'Philosophy', active: true },
    { id: 'psychology', name: 'Psychology', active: true },
    { id: 'science', name: 'Science (Biology, Chemistry, Physics)', active: true },
    { id: 'sociology', name: 'Sociology', active: true },
    { id: 'other', name: 'Other', active: true }
  ];

  // Derived data from config
  readonly extras = computed(() => this._config()?.extras?.filter(e => e.active) || []);
  readonly freeIncludes = computed(() => this._config()?.freeIncludes?.filter(f => f.active) || []);
  readonly subjectAreas = computed(() => {
    const configSubjects = this._config()?.subjectAreas?.filter(s => s.active);
    return configSubjects && configSubjects.length > 0 ? configSubjects : this.defaultSubjectAreas;
  });
  readonly moneyBackDays = computed(() => this._config()?.moneyBackGuaranteeDays || 60);
  readonly quoteExpirationDays = computed(() => this._config()?.quoteExpirationDays || 3);

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
      // Direct call to orchestrator (same approach as audit-log.service.ts)
      return 'http://localhost:8080/api/projects';
    } else if (hostname.includes('domyhomework')) {
      return 'https://orchestrator.learnbytesting.ai/api/projects';
    } else {
      return 'https://orchestrator.learnbytesting.ai/api/projects';
    }
  }

  // ===== PRICING CONFIG =====

  /**
   * Load pricing configuration (cached)
   */
  loadPricingConfig(): Observable<PricingConfig> {
    if (this.pricingConfig$) {
      return this.pricingConfig$;
    }

    this._isLoading.set(true);

    this.pricingConfig$ = this.http.get<ApiResponse<PricingConfig>>(
      `${this.baseUrl}/pricing-config`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.success && response.result) {
          this._config.set(response.result);
          this._isLoading.set(false);
          return response.result;
        }
        throw new Error(response.error || 'Failed to load pricing config');
      }),
      shareReplay(1),
      catchError(error => {
        this._isLoading.set(false);
        this.pricingConfig$ = null;
        console.error('[PricingService] Error loading config:', error);
        return throwError(() => error);
      })
    );

    return this.pricingConfig$;
  }

  /**
   * Force reload pricing configuration
   */
  refreshPricingConfig(): Observable<PricingConfig> {
    this.pricingConfig$ = null;
    return this.loadPricingConfig();
  }

  // ===== PRICE CALCULATION =====

  /**
   * Calculate price via API
   */
  calculatePrice(request: PriceCalculationRequest): Observable<PricingBreakdown> {
    this._isLoading.set(true);

    return this.http.post<ApiResponse<PricingBreakdown>>(
      `${this.baseUrl}/pricing-config/calculate`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        if (response.success && response.result) {
          this._currentBreakdown.set(response.result);
          this._isLoading.set(false);
          return response.result;
        }
        throw new Error(response.error || 'Failed to calculate price');
      }),
      catchError(error => {
        this._isLoading.set(false);
        console.error('[PricingService] Error calculating price:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Calculate price locally (for real-time updates without API calls)
   */
  calculatePriceLocally(
    academicLevel: AcademicLevel,
    serviceType: ServiceType,
    deadlineUrgency: DeadlineUrgency,
    numberOfPages: number,
    numberOfSources: number,
    selectedExtras: string[] = [],
    promoCode?: string
  ): PricingBreakdown | null {
    const config = this._config();
    if (!config) {
      return null;
    }

    // Get base price
    const basePrice = config.basePricePerPage?.[academicLevel] || config.basePricePerPage?.undergraduate || 18.99;

    // Get multipliers
    const deadlineMultiplier = config.deadlineMultipliers?.[deadlineUrgency] || 1.0;
    const serviceMultiplier = config.serviceTypeAdjustments?.[serviceType] || 1.0;

    // Calculate price per page
    const pricePerPage = basePrice * deadlineMultiplier * serviceMultiplier;

    // Calculate totals
    const pagesTotal = pricePerPage * (numberOfPages || 1);
    const sourcesTotal = (config.sourceCost || 5) * (numberOfSources || 0);

    // Calculate extras total
    let extrasTotal = 0;
    if (selectedExtras.length > 0) {
      const availableExtras = config.extras || [];
      selectedExtras.forEach(extraId => {
        const extra = availableExtras.find(e => e.id === extraId);
        if (extra) {
          extrasTotal += extra.price;
        }
      });
    }

    // Calculate subtotal
    let subtotal = pagesTotal + sourcesTotal + extrasTotal;

    // Apply promo code discount
    let discount = 0;
    const appliedPromo = this._appliedPromoCode();
    const promoDiscountValue = this._promoDiscount();
    const promoType = this._promoType();

    if (appliedPromo && promoDiscountValue) {
      if (promoType === 'percentage') {
        discount = subtotal * promoDiscountValue;
      } else {
        discount = promoDiscountValue;
      }
    }

    const finalPrice = Math.max(0, subtotal - discount);

    const breakdown: PricingBreakdown = {
      basePrice,
      deadlineMultiplier,
      serviceMultiplier,
      pricePerPage: Math.round(pricePerPage * 100) / 100,
      pagesTotal: Math.round(pagesTotal * 100) / 100,
      sourcesTotal: Math.round(sourcesTotal * 100) / 100,
      extrasTotal: Math.round(extrasTotal * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100
    };

    this._currentBreakdown.set(breakdown);
    return breakdown;
  }

  // ===== PROMO CODE =====

  /**
   * Validate a promo code
   */
  validatePromoCode(code: string): Observable<PromoValidationResponse> {
    return this.http.post<PromoValidationResponse>(
      `${this.baseUrl}/pricing-config/validate-promo`,
      { code },
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.valid) {
          this._appliedPromoCode.set(code.toUpperCase());
          this._promoDiscount.set(response.discount || 0);
          this._promoType.set(response.type || null);
          console.log('[PricingService] Promo code applied:', code);
        } else {
          this.clearPromoCode();
        }
      }),
      catchError(error => {
        console.error('[PricingService] Error validating promo:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Clear applied promo code
   */
  clearPromoCode(): void {
    this._appliedPromoCode.set(null);
    this._promoDiscount.set(0);
    this._promoType.set(null);
  }

  // ===== HELPER METHODS =====

  /**
   * Get price per page for academic level
   */
  getBasePriceForLevel(level: AcademicLevel): number {
    const config = this._config();
    if (!config) {
      return 18.99; // Default undergraduate price
    }
    return config.basePricePerPage?.[level] || 18.99;
  }

  /**
   * Get deadline multiplier
   */
  getDeadlineMultiplier(urgency: DeadlineUrgency): number {
    const config = this._config();
    if (!config) {
      return 1.0;
    }
    return config.deadlineMultipliers?.[urgency] || 1.0;
  }

  /**
   * Get service type multiplier
   */
  getServiceMultiplier(type: ServiceType): number {
    const config = this._config();
    if (!config) {
      return 1.0;
    }
    return config.serviceTypeAdjustments?.[type] || 1.0;
  }

  /**
   * Get extra item by ID
   */
  getExtraById(id: string): ExtraItem | undefined {
    return this.extras().find(e => e.id === id);
  }

  /**
   * Calculate estimated price for display
   */
  getEstimatedPrice(
    academicLevel: AcademicLevel,
    serviceType: ServiceType,
    deadlineUrgency: DeadlineUrgency,
    numberOfPages: number
  ): number {
    const breakdown = this.calculatePriceLocally(
      academicLevel,
      serviceType,
      deadlineUrgency,
      numberOfPages,
      0, // No sources for quick estimate
      []  // No extras for quick estimate
    );
    return breakdown?.finalPrice || 0;
  }

  /**
   * Format price for display
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  /**
   * Get savings text for deadline
   */
  getDeadlineSavings(urgency: DeadlineUrgency): string | null {
    const multiplier = this.getDeadlineMultiplier(urgency);
    if (multiplier < 1.0) {
      const savings = Math.round((1 - multiplier) * 100);
      return `Save ${savings}%`;
    }
    if (multiplier > 1.0) {
      const premium = Math.round((multiplier - 1) * 100);
      return `+${premium}% rush fee`;
    }
    return null;
  }

  // ===== PRIVATE HELPERS =====

  /**
   * Get HTTP headers
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
}
