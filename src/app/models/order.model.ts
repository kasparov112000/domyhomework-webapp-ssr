/**
 * Order Models for DoMyHomework.com
 * Defines TypeScript interfaces for customer orders
 * Separated from paper-submission which handles the submission wizard
 */

import {
  ServiceType,
  AcademicLevel,
  DeadlineUrgency,
  CitationStyle,
  SelectedExtra,
  PricingBreakdown,
  ExtraItem,
  FreeInclude,
  PromoCode,
  SubjectArea,
  PricingConfig
} from './paper-submission.model';

// Re-export pricing interfaces for convenience
export {
  PricingBreakdown,
  ExtraItem,
  FreeInclude,
  PromoCode,
  SubjectArea,
  PricingConfig
};

// ===== ORDER STATUS TYPES =====

export type OrderStatus =
  | 'pending'       // Order created, awaiting confirmation
  | 'confirmed'     // Payment confirmed, ready for assignment
  | 'in_progress'   // Expert assigned and working
  | 'review'        // Completed, under review
  | 'completed'     // Delivered to customer
  | 'cancelled'     // Order cancelled
  | 'refunded';     // Order refunded

export type PaymentStatus =
  | 'pending'       // Awaiting payment
  | 'processing'    // Payment being processed
  | 'paid'          // Payment successful
  | 'failed'        // Payment failed
  | 'refunded'      // Payment refunded
  | 'partial_refund'; // Partial refund issued

export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'stripe'
  | 'bank_transfer'
  | 'other';

// ===== DELIVERY INTERFACES =====

export interface DeliveryFile {
  fileId: string;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  uploadedAt: Date;
  downloadUrl?: string;
}

export interface Revision {
  _id?: string;
  requestedAt: Date;
  reason: string;
  instructions?: string;
  completedAt?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  responseNotes?: string;
}

// ===== ORDER INTERFACE =====

export interface Order {
  _id?: string;

  // Reference to paper submission (projects collection)
  submissionId: string;

  // Customer info
  customerId: string;
  customerEmail: string;
  customerName?: string;

  // Order details (snapshot from submission)
  title: string;
  serviceType: ServiceType;
  academicLevel: AcademicLevel;
  subjectArea: string;
  numberOfPages: number;
  numberOfSources: number;
  deadline: Date;
  deadlineUrgency: DeadlineUrgency;
  citationStyle?: CitationStyle;
  instructions?: string;

  // Pricing snapshot (frozen at order time)
  pricing: PricingBreakdown;

  // Selected extras
  extras: SelectedExtra[];

  // Promo applied
  promoCode?: string;
  promoDiscount?: number;

  // Status tracking
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentMethod?: PaymentMethod;

  // Assignment
  assignedExpertId?: string;
  assignedExpertName?: string;
  assignedAt?: Date;

  // Delivery
  deliveredAt?: Date;
  deliveryFiles: DeliveryFile[];

  // Revisions
  revisions: Revision[];
  revisionsAllowed: number;
  revisionsUsed: number;

  // Timestamps
  createdAt: Date;
  updatedAt?: Date;
  confirmedAt?: Date;
  completedAt?: Date;

  // Terms
  termsAccepted: boolean;
  termsAcceptedAt?: Date;

  // Notes
  adminNotes?: string;
  customerNotes?: string;

  // Quote expiration
  quoteExpiresAt?: Date;
}

// ===== API INTERFACES =====

export interface CreateOrderRequest {
  submissionId: string;
  customerId: string;
  customerEmail: string;
  customerName?: string;
  paymentMethod?: PaymentMethod;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
}

export interface AssignExpertRequest {
  expertId: string;
  expertName: string;
}

export interface DeliverOrderRequest {
  files: DeliveryFile[];
  notes?: string;
}

export interface RequestRevisionRequest {
  reason: string;
  instructions?: string;
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

export interface OrderListResponse {
  orders: Order[];
  total: number;
  page: number;
  pageSize: number;
}

// ===== ORDER FILTERS =====

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  customerId?: string;
  assignedExpertId?: string;
  fromDate?: Date;
  toDate?: Date;
  searchTerm?: string;
}
