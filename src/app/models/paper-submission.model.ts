/**
 * Paper Submission Models for DoMyHomework.com
 * Defines TypeScript interfaces for the multi-step paper submission wizard
 */

// ===== ENUMS =====

export type ServiceType = 'writing' | 'editing' | 'proofreading' | 'other';
export type AcademicLevel = 'highschool' | 'undergraduate' | 'masters' | 'phd';
export type DeadlineUrgency = '3hours' | '6hours' | '12hours' | '24hours' | '48hours' | '3days' | '7days' | '14days' | '30days';
export type ProjectPurpose = 'academic' | 'professional' | 'personal';
export type PaperType = 'essay' | 'research_paper' | 'thesis' | 'dissertation' | 'report' | 'case_study' | 'term_paper' | 'other';
export type CitationStyle = 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee' | 'none';

// ===== STEP INTERFACES =====

export interface WelcomeStepData {
  userId?: string;
  email?: string;
  isAuthenticated: boolean;
}

export interface KeyDetailsStepData {
  serviceType: ServiceType;
  academicLevel: AcademicLevel;
  subjectArea: string;
  numberOfPages: number;
  deadline: Date;
  deadlineUrgency: DeadlineUrgency;
  projectPurpose: ProjectPurpose;
  paperType: PaperType;
  expertPreference: ExpertPreference;
}

export interface InstructionsStepData {
  title: string;
  instructions: string;
  citationStyle: CitationStyle;
  numberOfSources: number;
  additionalNotes?: string;
  documents?: UploadedDocument[];
}

export interface ReviewStepData {
  selectedExtras: SelectedExtra[];
  promoCode?: string;
  promoCodeValid?: boolean;
  termsAccepted: boolean;
  pricingBreakdown?: PricingBreakdown;
  estimatedPrice?: number;
}

// ===== SUB-INTERFACES =====

export interface ExpertPreference {
  enabled: boolean;
  specialty?: string;
}

export interface SelectedExtra {
  id: string;
  name: string;
  price: number;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: Date;
}

// ===== PRICING INTERFACES =====

export interface PricingBreakdown {
  basePrice: number;
  deadlineMultiplier: number;
  serviceMultiplier: number;
  pricePerPage: number;
  pagesTotal: number;
  sourcesTotal: number;
  extrasTotal: number;
  subtotal: number;
  discount: number;
  finalPrice: number;
}

export interface ExtraItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
}

export interface FreeInclude {
  name: string;
  displayPrice: number;
  active: boolean;
}

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  active: boolean;
  expiresAt?: Date;
  usageLimit?: number;
  usageCount?: number;
}

export interface SubjectArea {
  id: string;
  name: string;
  active: boolean;
}

export interface PricingConfig {
  _id?: string;
  configType: string;
  basePricePerPage: {
    highschool: number;
    undergraduate: number;
    masters: number;
    phd: number;
  };
  deadlineMultipliers: {
    '3hours': number;
    '6hours': number;
    '12hours': number;
    '24hours': number;
    '48hours': number;
    '3days': number;
    '7days': number;
    '14days': number;
    '30days': number;
  };
  serviceTypeAdjustments: {
    writing: number;
    editing: number;
    proofreading: number;
    other: number;
  };
  sourceCost: number;
  extras: ExtraItem[];
  freeIncludes: FreeInclude[];
  promoCodes: PromoCode[];
  subjectAreas: SubjectArea[];
  quoteExpirationDays: number;
  moneyBackGuaranteeDays: number;
  active: boolean;
  createdDate?: Date;
  modifiedDate?: Date;

  // Dynamic form options (from order-form-options.model.ts)
  serviceTypeOptions?: any[];
  academicLevelOptions?: any[];
  deadlineOptions?: any[];
  paperTypeOptions?: any[];
  projectPurposeOptions?: any[];
  citationStyleOptions?: any[];
}

// ===== SUBMISSION INTERFACE =====

export interface PaperSubmission {
  _id?: string;
  submissionType: 'paper_submission';

  // Step 1: Welcome (user info)
  createdByGuid?: string;
  userId?: string;

  // Step 2: Key Details
  serviceType?: ServiceType;
  academicLevel?: AcademicLevel;
  subjectArea?: string;
  numberOfPages?: number;
  deadline?: Date;
  deadlineUrgency?: DeadlineUrgency;
  projectPurpose?: ProjectPurpose;
  paperType?: PaperType;
  expertPreference?: ExpertPreference;

  // Step 3: Instructions
  title?: string;
  instructions?: string;
  citationStyle?: CitationStyle;
  numberOfSources?: number;
  additionalNotes?: string;
  documents?: UploadedDocument[];

  // Step 4: Review & Checkout
  selectedExtras?: SelectedExtra[];
  promoCode?: string;
  promoCodeValid?: boolean;
  pricingBreakdown?: PricingBreakdown;
  estimatedPrice?: number;
  termsAccepted?: boolean;
  termsAcceptedDate?: Date;
  quoteExpiresAt?: Date;

  // Tracking
  currentStep: number;
  completedSteps: number[];
  isDraft: boolean;
  submittedAt?: Date;
  lastSavedAt?: Date;

  // Metadata (from project schema)
  name?: string;
  summary?: string;
  status?: number;
  createdDate?: Date;
  modifiedDate?: Date;
}

// ===== API RESPONSE INTERFACES =====

export interface ApiResponse<T> {
  success: boolean;
  result?: T;
  error?: string;
  message?: string;
}

export interface PromoValidationResponse {
  success: boolean;
  valid: boolean;
  discount?: number;
  type?: 'percentage' | 'fixed';
  message: string;
}

export interface PriceCalculationRequest {
  academicLevel: AcademicLevel;
  serviceType: ServiceType;
  deadlineUrgency: DeadlineUrgency;
  numberOfPages: number;
  numberOfSources: number;
  selectedExtras?: string[];
  promoCode?: string;
}

// ===== STEPPER STATE =====

export interface StepperState {
  currentStep: number;
  completedSteps: number[];
  submissionId?: string;
  isLoading: boolean;
  isSaving: boolean;
  lastSavedAt?: Date;
  error?: string;
}

export const STEP_LABELS = [
  'Welcome',
  'Key Details',
  'Instructions',
  'Review & Checkout'
] as const;

export const STEP_DESCRIPTIONS = [
  'Create your account or sign in',
  'Tell us about your project',
  'Provide detailed instructions',
  'Review and submit your order'
] as const;

// ===== DROPDOWN OPTIONS =====

export const SERVICE_TYPE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: 'writing', label: 'Writing from scratch' },
  { value: 'editing', label: 'Editing & Improvement' },
  { value: 'proofreading', label: 'Proofreading' },
  { value: 'other', label: 'Other' }
];

export const ACADEMIC_LEVEL_OPTIONS: { value: AcademicLevel; label: string }[] = [
  { value: 'highschool', label: 'High School' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'masters', label: 'Masters' },
  { value: 'phd', label: 'PhD' }
];

export const DEADLINE_OPTIONS: { value: DeadlineUrgency; label: string; hours: number }[] = [
  { value: '3hours', label: '3 Hours', hours: 3 },
  { value: '6hours', label: '6 Hours', hours: 6 },
  { value: '12hours', label: '12 Hours', hours: 12 },
  { value: '24hours', label: '24 Hours', hours: 24 },
  { value: '48hours', label: '2 Days', hours: 48 },
  { value: '3days', label: '3 Days', hours: 72 },
  { value: '7days', label: '7 Days', hours: 168 },
  { value: '14days', label: '14 Days', hours: 336 },
  { value: '30days', label: '30 Days', hours: 720 }
];

export const PROJECT_PURPOSE_OPTIONS: { value: ProjectPurpose; label: string }[] = [
  { value: 'academic', label: 'Academic' },
  { value: 'professional', label: 'Professional' },
  { value: 'personal', label: 'Personal' }
];

export const PAPER_TYPE_OPTIONS: { value: PaperType; label: string }[] = [
  { value: 'essay', label: 'Essay' },
  { value: 'research_paper', label: 'Research Paper' },
  { value: 'thesis', label: 'Thesis' },
  { value: 'dissertation', label: 'Dissertation' },
  { value: 'report', label: 'Report' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'term_paper', label: 'Term Paper' },
  { value: 'other', label: 'Other' }
];

export const CITATION_STYLE_OPTIONS: { value: CitationStyle; label: string }[] = [
  { value: 'apa', label: 'APA' },
  { value: 'mla', label: 'MLA' },
  { value: 'chicago', label: 'Chicago' },
  { value: 'harvard', label: 'Harvard' },
  { value: 'ieee', label: 'IEEE' },
  { value: 'none', label: 'None / Not Applicable' }
];
