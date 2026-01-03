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
import {
  FilterableOption,
  ServiceTypeOption,
  AcademicLevelOption,
  DeadlineOption,
  PaperTypeOption,
  ProjectPurposeOption,
  CitationStyleOption,
  SubjectAreaOption,
  filterOptions,
  sortOptions
} from '../models/order-form-options.model';

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

  // Default service type options as fallback
  private readonly defaultServiceTypes: ServiceTypeOption[] = [
    { id: 'writing', value: 'writing', label: 'Writing from scratch', active: true, sortOrder: 0, priceMultiplier: 1.0, filterBy: 'none' },
    { id: 'editing', value: 'editing', label: 'Editing', active: true, sortOrder: 1, priceMultiplier: 0.7, filterBy: 'none' },
    { id: 'proofreading', value: 'proofreading', label: 'Proofreading', active: true, sortOrder: 2, priceMultiplier: 0.5, filterBy: 'none' },
    { id: 'rewriting', value: 'rewriting', label: 'Rewriting', active: true, sortOrder: 3, priceMultiplier: 0.8, filterBy: 'none' },
    { id: 'problem_solving', value: 'problem_solving', label: 'Problem Solving', active: true, sortOrder: 4, priceMultiplier: 1.2, filterBy: 'none' }
  ];

  // Default academic level options as fallback
  private readonly defaultAcademicLevels: AcademicLevelOption[] = [
    { id: 'highschool', value: 'highschool', label: 'High School', active: true, sortOrder: 0, basePrice: 14.99 },
    { id: 'undergraduate', value: 'undergraduate', label: 'Undergraduate', active: true, sortOrder: 1, basePrice: 18.99 },
    { id: 'masters', value: 'masters', label: 'Master\'s', active: true, sortOrder: 2, basePrice: 24.99 },
    { id: 'phd', value: 'phd', label: 'PhD', active: true, sortOrder: 3, basePrice: 29.99 }
  ];

  // Default deadline options as fallback
  private readonly defaultDeadlines: DeadlineOption[] = [
    { id: '3h', value: '3h', label: '3 hours', hours: 3, priceMultiplier: 2.0, active: true, sortOrder: 0, filterBy: 'none' },
    { id: '6h', value: '6h', label: '6 hours', hours: 6, priceMultiplier: 1.8, active: true, sortOrder: 1, filterBy: 'none' },
    { id: '12h', value: '12h', label: '12 hours', hours: 12, priceMultiplier: 1.6, active: true, sortOrder: 2, filterBy: 'none' },
    { id: '24h', value: '24h', label: '24 hours', hours: 24, priceMultiplier: 1.4, active: true, sortOrder: 3, filterBy: 'none' },
    { id: '48h', value: '48h', label: '2 days', hours: 48, priceMultiplier: 1.2, active: true, sortOrder: 4, filterBy: 'none' },
    { id: '3d', value: '3d', label: '3 days', hours: 72, priceMultiplier: 1.1, active: true, sortOrder: 5, filterBy: 'none' },
    { id: '5d', value: '5d', label: '5 days', hours: 120, priceMultiplier: 1.0, active: true, sortOrder: 6, filterBy: 'none' },
    { id: '7d', value: '7d', label: '7 days', hours: 168, priceMultiplier: 1.0, active: true, sortOrder: 7, filterBy: 'none' },
    { id: '14d', value: '14d', label: '14 days', hours: 336, priceMultiplier: 0.9, active: true, sortOrder: 8, filterBy: 'none' }
  ];

  // Default paper type options as fallback
  private readonly defaultPaperTypes: PaperTypeOption[] = [
    { id: 'essay', value: 'essay', label: 'Essay', active: true, sortOrder: 0, filterBy: 'none' },
    { id: 'research_paper', value: 'research_paper', label: 'Research Paper', active: true, sortOrder: 1, filterBy: 'none' },
    { id: 'term_paper', value: 'term_paper', label: 'Term Paper', active: true, sortOrder: 2, filterBy: 'none' },
    { id: 'thesis', value: 'thesis', label: 'Thesis', active: true, sortOrder: 3, filterBy: 'academicLevel', academicLevels: ['masters', 'phd'] },
    { id: 'dissertation', value: 'dissertation', label: 'Dissertation', active: true, sortOrder: 4, filterBy: 'academicLevel', academicLevels: ['phd'] },
    { id: 'case_study', value: 'case_study', label: 'Case Study', active: true, sortOrder: 5, filterBy: 'none' },
    { id: 'book_report', value: 'book_report', label: 'Book Report', active: true, sortOrder: 6, filterBy: 'none' },
    { id: 'article_review', value: 'article_review', label: 'Article Review', active: true, sortOrder: 7, filterBy: 'none' },
    { id: 'coursework', value: 'coursework', label: 'Coursework', active: true, sortOrder: 8, filterBy: 'none' },
    { id: 'lab_report', value: 'lab_report', label: 'Lab Report', active: true, sortOrder: 9, filterBy: 'subjectArea', subjectAreas: ['science', 'engineering', 'healthcare'] },
    { id: 'presentation', value: 'presentation', label: 'Presentation/PPT', active: true, sortOrder: 10, filterBy: 'none' },
    { id: 'other', value: 'other', label: 'Other', active: true, sortOrder: 99, filterBy: 'none' }
  ];

  // Default project purpose options as fallback
  private readonly defaultProjectPurposes: ProjectPurposeOption[] = [
    { id: 'academic', value: 'academic', label: 'Academic', active: true, sortOrder: 0, filterBy: 'none' },
    { id: 'professional', value: 'professional', label: 'Professional', active: true, sortOrder: 1, filterBy: 'none' },
    { id: 'personal', value: 'personal', label: 'Personal', active: true, sortOrder: 2, filterBy: 'none' }
  ];

  // Default citation style options as fallback
  private readonly defaultCitationStyles: CitationStyleOption[] = [
    { id: 'apa7', value: 'apa7', label: 'APA 7th Edition', active: true, sortOrder: 0, filterBy: 'none' },
    { id: 'mla9', value: 'mla9', label: 'MLA 9th Edition', active: true, sortOrder: 1, filterBy: 'none' },
    { id: 'chicago', value: 'chicago', label: 'Chicago/Turabian', active: true, sortOrder: 2, filterBy: 'none' },
    { id: 'harvard', value: 'harvard', label: 'Harvard', active: true, sortOrder: 3, filterBy: 'none' },
    { id: 'ieee', value: 'ieee', label: 'IEEE', active: true, sortOrder: 4, filterBy: 'subjectArea', subjectAreas: ['engineering', 'computer_science'] },
    { id: 'ama', value: 'ama', label: 'AMA', active: true, sortOrder: 5, filterBy: 'subjectArea', subjectAreas: ['healthcare', 'science'] },
    { id: 'bluebook', value: 'bluebook', label: 'Bluebook', active: true, sortOrder: 6, filterBy: 'subjectArea', subjectAreas: ['law'] },
    { id: 'vancouver', value: 'vancouver', label: 'Vancouver', active: true, sortOrder: 7, filterBy: 'subjectArea', subjectAreas: ['healthcare', 'science'] },
    { id: 'other', value: 'other', label: 'Other', active: true, sortOrder: 99, filterBy: 'none' },
    { id: 'not_required', value: 'not_required', label: 'Not Required', active: true, sortOrder: 100, filterBy: 'none' }
  ];

  // Default subject area options with pricing (enhanced)
  private readonly defaultSubjectAreaOptions: SubjectAreaOption[] = [
    { id: 'business', name: 'Business & Management', active: true, sortOrder: 0, priceMultiplier: 1.0 },
    { id: 'computer_science', name: 'Computer Science & IT', active: true, sortOrder: 1, priceMultiplier: 1.1 },
    { id: 'economics', name: 'Economics', active: true, sortOrder: 2, priceMultiplier: 1.0 },
    { id: 'education', name: 'Education', active: true, sortOrder: 3, priceMultiplier: 1.0 },
    { id: 'engineering', name: 'Engineering', active: true, sortOrder: 4, priceMultiplier: 1.15 },
    { id: 'english', name: 'English & Literature', active: true, sortOrder: 5, priceMultiplier: 1.0 },
    { id: 'healthcare', name: 'Healthcare & Nursing', active: true, sortOrder: 6, priceMultiplier: 1.1 },
    { id: 'history', name: 'History', active: true, sortOrder: 7, priceMultiplier: 1.0 },
    { id: 'law', name: 'Law', active: true, sortOrder: 8, priceMultiplier: 1.2 },
    { id: 'marketing', name: 'Marketing', active: true, sortOrder: 9, priceMultiplier: 1.0 },
    { id: 'mathematics', name: 'Mathematics', active: true, sortOrder: 10, priceMultiplier: 1.15 },
    { id: 'philosophy', name: 'Philosophy', active: true, sortOrder: 11, priceMultiplier: 1.0 },
    { id: 'psychology', name: 'Psychology', active: true, sortOrder: 12, priceMultiplier: 1.0 },
    { id: 'science', name: 'Science (Biology, Chemistry, Physics)', active: true, sortOrder: 13, priceMultiplier: 1.1 },
    { id: 'sociology', name: 'Sociology', active: true, sortOrder: 14, priceMultiplier: 1.0 },
    { id: 'other', name: 'Other', active: true, sortOrder: 99, priceMultiplier: 1.0 }
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

  // ===== DYNAMIC FORM OPTIONS =====
  // These computed signals provide form dropdown options from config with fallback to defaults

  /**
   * Service type options (Writing, Editing, Proofreading, etc.)
   * Filtered by active status and sorted by sortOrder
   */
  readonly serviceTypeOptions = computed((): ServiceTypeOption[] => {
    const config = this._config();
    const options = config?.serviceTypeOptions;
    return options && options.length > 0
      ? sortOptions(options)
      : this.defaultServiceTypes.filter(o => o.active);
  });

  /**
   * Academic level options (High School, Undergraduate, Masters, PhD)
   * Sorted by sortOrder
   */
  readonly academicLevelOptions = computed((): AcademicLevelOption[] => {
    const config = this._config();
    const options = config?.academicLevelOptions;
    return options && options.length > 0
      ? sortOptions(options)
      : this.defaultAcademicLevels.filter(o => o.active);
  });

  /**
   * Deadline options (3 hours, 6 hours, 7 days, etc.)
   * Sorted by sortOrder
   */
  readonly deadlineOptions = computed((): DeadlineOption[] => {
    const config = this._config();
    const options = config?.deadlineOptions;
    return options && options.length > 0
      ? sortOptions(options)
      : this.defaultDeadlines.filter(o => o.active);
  });

  /**
   * Paper type options (Essay, Research Paper, Thesis, etc.)
   * Can be filtered by academic level or subject area
   */
  readonly paperTypeOptions = computed((): PaperTypeOption[] => {
    const config = this._config();
    const options = config?.paperTypeOptions;
    return options && options.length > 0
      ? sortOptions(options)
      : this.defaultPaperTypes.filter(o => o.active);
  });

  /**
   * Project purpose options (Academic, Professional, Personal)
   */
  readonly projectPurposeOptions = computed((): ProjectPurposeOption[] => {
    const config = this._config();
    const options = config?.projectPurposeOptions;
    return options && options.length > 0
      ? sortOptions(options)
      : this.defaultProjectPurposes.filter(o => o.active);
  });

  /**
   * Citation style options (APA, MLA, Chicago, etc.)
   * Can be filtered by subject area
   */
  readonly citationStyleOptions = computed((): CitationStyleOption[] => {
    const config = this._config();
    const options = config?.citationStyleOptions;
    return options && options.length > 0
      ? sortOptions(options)
      : this.defaultCitationStyles.filter(o => o.active);
  });

  /**
   * Subject area options with pricing multipliers
   */
  readonly subjectAreaOptions = computed((): SubjectAreaOption[] => {
    const config = this._config();
    const options = config?.subjectAreas as SubjectAreaOption[];
    return options && options.length > 0
      ? sortOptions(options)
      : this.defaultSubjectAreaOptions.filter(o => o.active);
  });

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

  // ===== DYNAMIC OPTION FILTERING =====

  /**
   * Get filtered paper types based on academic level and/or subject area
   * Uses the filterBy field on each option to determine filtering behavior
   */
  getFilteredPaperTypes(academicLevel?: string, subjectArea?: string): PaperTypeOption[] {
    return filterOptions(this.paperTypeOptions(), academicLevel, subjectArea);
  }

  /**
   * Get filtered deadlines based on academic level and/or subject area
   * (deadlines might have restrictions for certain academic levels)
   */
  getFilteredDeadlines(academicLevel?: string, subjectArea?: string): DeadlineOption[] {
    return filterOptions(this.deadlineOptions(), academicLevel, subjectArea);
  }

  /**
   * Get filtered service types based on academic level and/or subject area
   */
  getFilteredServiceTypes(academicLevel?: string, subjectArea?: string): ServiceTypeOption[] {
    return filterOptions(this.serviceTypeOptions(), academicLevel, subjectArea);
  }

  /**
   * Get filtered citation styles based on subject area
   * (e.g., IEEE for engineering, Bluebook for law)
   */
  getFilteredCitationStyles(academicLevel?: string, subjectArea?: string): CitationStyleOption[] {
    return filterOptions(this.citationStyleOptions(), academicLevel, subjectArea);
  }

  /**
   * Get filtered project purposes based on academic level
   */
  getFilteredProjectPurposes(academicLevel?: string, subjectArea?: string): ProjectPurposeOption[] {
    return filterOptions(this.projectPurposeOptions(), academicLevel, subjectArea);
  }

  /**
   * Get subject area price multiplier
   */
  getSubjectAreaMultiplier(subjectAreaId: string): number {
    const subjectArea = this.subjectAreaOptions().find(s => s.id === subjectAreaId);
    return subjectArea?.priceMultiplier || 1.0;
  }

  /**
   * Get academic level base price
   */
  getAcademicLevelBasePrice(academicLevelId: string): number {
    const level = this.academicLevelOptions().find(l => l.id === academicLevelId || l.value === academicLevelId);
    return level?.basePrice || 18.99;
  }

  /**
   * Get deadline multiplier from dynamic options
   */
  getDeadlineMultiplierFromOptions(deadlineId: string): number {
    const deadline = this.deadlineOptions().find(d => d.id === deadlineId || d.value === deadlineId);
    return deadline?.priceMultiplier || 1.0;
  }

  /**
   * Get service type multiplier from dynamic options
   */
  getServiceTypeMultiplierFromOptions(serviceTypeId: string): number {
    const service = this.serviceTypeOptions().find(s => s.id === serviceTypeId || s.value === serviceTypeId);
    return service?.priceMultiplier || 1.0;
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
