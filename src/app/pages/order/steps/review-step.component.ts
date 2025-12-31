import { Component, Output, EventEmitter, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { PaperSubmissionService } from '../../../services/paper-submission.service';
import { PricingService } from '../../../services/pricing.service';
import { ExtraItem, SelectedExtra } from '../../../models/paper-submission.model';

@Component({
  selector: 'app-review-step',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="review-step">
      <!-- Order Summary -->
      <div class="summary-section">
        <h3>Order Summary</h3>
        <div class="summary-card">
          <div class="summary-row">
            <span class="label">Paper Type</span>
            <span class="value">{{ submission()?.paperType | titlecase }}</span>
          </div>
          <div class="summary-row">
            <span class="label">Academic Level</span>
            <span class="value">{{ submission()?.academicLevel | titlecase }}</span>
          </div>
          <div class="summary-row">
            <span class="label">Subject</span>
            <span class="value">{{ getSubjectName(submission()?.subjectArea) }}</span>
          </div>
          <div class="summary-row">
            <span class="label">Pages</span>
            <span class="value">{{ submission()?.numberOfPages }} pages ({{ (submission()?.numberOfPages || 1) * 275 }} words)</span>
          </div>
          <div class="summary-row">
            <span class="label">Deadline</span>
            <span class="value">{{ submission()?.deadline | date:'medium' }}</span>
          </div>
          <div class="summary-row">
            <span class="label">Citation Style</span>
            <span class="value">{{ submission()?.citationStyle | uppercase }}</span>
          </div>
          @if ((submission()?.numberOfSources || 0) > 0) {
            <div class="summary-row">
              <span class="label">Sources</span>
              <span class="value">{{ submission()?.numberOfSources }} sources</span>
            </div>
          }
        </div>
      </div>

      <!-- Optional Extras -->
      <div class="extras-section">
        <h3>Optional Extras</h3>
        <div class="extras-list">
          @for (extra of availableExtras(); track extra.id) {
            <label class="extra-item" [class.selected]="isExtraSelected(extra.id)">
              <input
                type="checkbox"
                [checked]="isExtraSelected(extra.id)"
                (change)="toggleExtra(extra)"
              >
              <div class="extra-content">
                <div class="extra-header">
                  <span class="extra-name">{{ extra.name }}</span>
                  <span class="extra-price">+{{ formatPrice(extra.price) }}</span>
                </div>
                @if (extra.description) {
                  <p class="extra-description">{{ extra.description }}</p>
                }
              </div>
            </label>
          }
        </div>
      </div>

      <!-- Free Includes -->
      <div class="free-section">
        <h3>Included FREE with Your Order</h3>
        <div class="free-list">
          @for (item of freeIncludes(); track item.name) {
            <div class="free-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span class="item-name">{{ item.name }}</span>
              <span class="item-price">{{ formatPrice(item.displayPrice) }}</span>
            </div>
          }
        </div>
        <div class="free-total">
          <span>Total Value</span>
          <span>{{ formatPrice(freeTotal()) }}</span>
        </div>
      </div>

      <!-- Promo Code -->
      <div class="promo-section">
        <h3>Promo Code</h3>
        <div class="promo-input">
          <input
            type="text"
            [(ngModel)]="promoCodeInput"
            placeholder="Enter promo code"
            [disabled]="!!appliedPromoCode()"
          >
          @if (appliedPromoCode()) {
            <button type="button" class="btn-clear" (click)="clearPromo()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          } @else {
            <button
              type="button"
              class="btn-apply"
              (click)="applyPromo()"
              [disabled]="!promoCodeInput || isValidatingPromo()"
            >
              @if (isValidatingPromo()) {
                <span class="spinner"></span>
              } @else {
                Apply
              }
            </button>
          }
        </div>
        @if (promoMessage()) {
          <p class="promo-message" [class.success]="appliedPromoCode()" [class.error]="!appliedPromoCode() && promoMessage()">
            {{ promoMessage() }}
          </p>
        }
      </div>

      <!-- Price Breakdown -->
      <div class="price-section">
        <h3>Price Details</h3>
        <div class="price-breakdown">
          <div class="price-row">
            <span>{{ submission()?.numberOfPages }} page(s) × {{ formatPrice(breakdown()?.pricePerPage || 0) }}</span>
            <span>{{ formatPrice(breakdown()?.pagesTotal || 0) }}</span>
          </div>
          @if ((breakdown()?.sourcesTotal || 0) > 0) {
            <div class="price-row">
              <span>{{ submission()?.numberOfSources }} source(s)</span>
              <span>{{ formatPrice(breakdown()?.sourcesTotal || 0) }}</span>
            </div>
          }
          @if ((breakdown()?.extrasTotal || 0) > 0) {
            <div class="price-row">
              <span>Optional extras</span>
              <span>{{ formatPrice(breakdown()?.extrasTotal || 0) }}</span>
            </div>
          }

          <div class="price-divider"></div>

          <div class="price-row subtotal">
            <span>Subtotal</span>
            <span>{{ formatPrice(breakdown()?.subtotal || 0) }}</span>
          </div>

          @if ((breakdown()?.discount || 0) > 0) {
            <div class="price-row discount">
              <span>Discount</span>
              <span>-{{ formatPrice(breakdown()?.discount || 0) }}</span>
            </div>
          }

          <div class="price-row total">
            <span>Total</span>
            <span class="total-price">{{ formatPrice(breakdown()?.finalPrice || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- Terms & Conditions -->
      <div class="terms-section">
        <label class="terms-checkbox">
          <input
            type="checkbox"
            [(ngModel)]="termsAccepted"
          >
          <span>
            I agree to the <a href="/terms" target="_blank">Terms of Service</a> and
            <a href="/privacy" target="_blank">Privacy Policy</a>
          </span>
        </label>
      </div>

      <!-- Guarantee -->
      <div class="guarantee-section">
        <div class="guarantee-badge">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
          <div class="guarantee-text">
            <strong>{{ moneyBackDays() }}-Day Money Back Guarantee</strong>
            <p>Not satisfied? Get a full refund within {{ moneyBackDays() }} days.</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="step-navigation">
        <button type="button" class="btn-secondary" (click)="onPrevious()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back
        </button>
        <button
          type="button"
          class="btn-submit"
          (click)="onSubmit()"
          [disabled]="!termsAccepted || isSubmitting()"
        >
          @if (isSubmitting()) {
            <span class="spinner"></span> Processing...
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            Secure Checkout - {{ formatPrice(breakdown()?.finalPrice || 0) }}
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    .review-step {
      max-width: 720px;
      margin: 0 auto;
    }

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1rem 0;
    }

    /* Summary Section */
    .summary-section {
      margin-bottom: 2rem;
    }

    .summary-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .summary-row:last-child {
      border-bottom: none;
    }

    .summary-row .label {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .summary-row .value {
      color: #1f2937;
      font-weight: 500;
      font-size: 0.875rem;
    }

    /* Extras Section */
    .extras-section {
      margin-bottom: 2rem;
    }

    .extras-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .extra-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .extra-item:hover {
      border-color: #f5a580;
    }

    .extra-item.selected {
      border-color: #D04A02;
      background: #fef5f0;
    }

    .extra-item input[type="checkbox"] {
      width: 1.25rem;
      height: 1.25rem;
      margin-top: 0.125rem;
      accent-color: #D04A02;
    }

    .extra-content {
      flex: 1;
    }

    .extra-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .extra-name {
      font-weight: 500;
      color: #1f2937;
    }

    .extra-price {
      font-weight: 600;
      color: #D04A02;
    }

    .extra-description {
      font-size: 0.8125rem;
      color: #6b7280;
      margin: 0.25rem 0 0 0;
    }

    /* Free Section */
    .free-section {
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 0.5rem;
    }

    .free-section h3 {
      color: #166534;
    }

    .free-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .free-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .free-item svg {
      width: 1.25rem;
      height: 1.25rem;
      color: #16a34a;
    }

    .free-item .item-name {
      flex: 1;
      font-size: 0.875rem;
      color: #166534;
    }

    .free-item .item-price {
      font-size: 0.8125rem;
      text-decoration: line-through;
      color: #86efac;
    }

    .free-total {
      display: flex;
      justify-content: space-between;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #bbf7d0;
      font-weight: 600;
      color: #166534;
    }

    /* Promo Section */
    .promo-section {
      margin-bottom: 2rem;
    }

    .promo-input {
      display: flex;
      gap: 0.5rem;
    }

    .promo-input input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
    }

    .promo-input input:focus {
      outline: none;
      border-color: #D04A02;
    }

    .promo-input input:disabled {
      background: #f3f4f6;
    }

    .btn-apply {
      padding: 0.75rem 1.25rem;
      background: #D04A02;
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-apply:hover:not(:disabled) {
      background: #B03902;
    }

    .btn-apply:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-clear {
      padding: 0.75rem;
      background: #fee2e2;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-clear svg {
      width: 1.25rem;
      height: 1.25rem;
      color: #dc2626;
    }

    .promo-message {
      font-size: 0.8125rem;
      margin-top: 0.5rem;
    }

    .promo-message.success {
      color: #16a34a;
    }

    .promo-message.error {
      color: #dc2626;
    }

    /* Price Section */
    .price-section {
      margin-bottom: 2rem;
    }

    .price-breakdown {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.9375rem;
      color: #4b5563;
    }

    .price-row.subtotal {
      font-weight: 500;
    }

    .price-row.discount {
      color: #16a34a;
    }

    .price-row.total {
      font-weight: 600;
      font-size: 1.125rem;
      color: #1f2937;
      padding-top: 1rem;
    }

    .total-price {
      color: #D04A02;
      font-size: 1.5rem;
    }

    .price-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 0.5rem 0;
    }

    /* Terms Section */
    .terms-section {
      margin-bottom: 1.5rem;
    }

    .terms-checkbox {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
    }

    .terms-checkbox input {
      width: 1.25rem;
      height: 1.25rem;
      margin-top: 0.125rem;
      accent-color: #D04A02;
    }

    .terms-checkbox span {
      font-size: 0.9375rem;
      color: #4b5563;
    }

    .terms-checkbox a {
      color: #D04A02;
      text-decoration: none;
    }

    .terms-checkbox a:hover {
      text-decoration: underline;
    }

    /* Guarantee Section */
    .guarantee-section {
      margin-bottom: 2rem;
    }

    .guarantee-badge {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #fefce8;
      border: 1px solid #fde047;
      border-radius: 0.5rem;
    }

    .guarantee-badge svg {
      width: 2.5rem;
      height: 2.5rem;
      color: #ca8a04;
      flex-shrink: 0;
    }

    .guarantee-text strong {
      display: block;
      color: #854d0e;
      margin-bottom: 0.25rem;
    }

    .guarantee-text p {
      font-size: 0.8125rem;
      color: #a16207;
      margin: 0;
    }

    /* Navigation */
    .step-navigation {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-secondary:hover {
      background: #f9fafb;
    }

    .btn-secondary svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .btn-submit {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      flex: 1;
      max-width: 320px;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-submit:hover:not(:disabled) {
      background: linear-gradient(135deg, #059669, #047857);
      transform: translateY(-1px);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-submit svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ReviewStepComponent implements OnInit, OnDestroy {
  @Output() stepComplete = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  private submissionService = inject(PaperSubmissionService);
  private pricingService = inject(PricingService);
  private destroy$ = new Subject<void>();

  // State
  selectedExtras = signal<SelectedExtra[]>([]);
  promoCodeInput = '';
  promoMessage = signal<string | null>(null);
  isValidatingPromo = signal(false);
  isSubmitting = signal(false);
  termsAccepted = false;

  // From services
  readonly submission = this.submissionService.currentSubmission;
  readonly breakdown = this.pricingService.currentBreakdown;
  readonly availableExtras = this.pricingService.extras;
  readonly freeIncludes = this.pricingService.freeIncludes;
  readonly appliedPromoCode = this.pricingService.appliedPromoCode;
  readonly moneyBackDays = this.pricingService.moneyBackDays;

  // Computed
  readonly freeTotal = computed(() => {
    return this.freeIncludes().reduce((sum, item) => sum + item.displayPrice, 0);
  });

  ngOnInit(): void {
    // Load any previously selected extras
    const submission = this.submissionService.currentSubmission();
    if (submission?.selectedExtras) {
      this.selectedExtras.set(submission.selectedExtras);
    }

    // Recalculate price with current data
    this.updatePriceCalculation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updatePriceCalculation(): void {
    const submission = this.submission();
    if (!submission) return;

    this.pricingService.calculatePriceLocally(
      submission.academicLevel || 'undergraduate',
      submission.serviceType || 'writing',
      submission.deadlineUrgency || '7days',
      submission.numberOfPages || 1,
      submission.numberOfSources || 0,
      this.selectedExtras().map(e => e.id),
      this.appliedPromoCode() || undefined
    );
  }

  isExtraSelected(id: string): boolean {
    return this.selectedExtras().some(e => e.id === id);
  }

  toggleExtra(extra: ExtraItem): void {
    const current = this.selectedExtras();
    const isSelected = current.some(e => e.id === extra.id);

    if (isSelected) {
      this.selectedExtras.set(current.filter(e => e.id !== extra.id));
    } else {
      this.selectedExtras.set([...current, {
        id: extra.id,
        name: extra.name,
        price: extra.price
      }]);
    }

    this.updatePriceCalculation();
  }

  getSubjectName(id: string | undefined): string {
    if (!id) return 'Not specified';
    const subjects = this.pricingService.subjectAreas();
    const subject = subjects.find(s => s.id === id);
    return subject?.name || id;
  }

  applyPromo(): void {
    if (!this.promoCodeInput) return;

    this.isValidatingPromo.set(true);
    this.promoMessage.set(null);

    this.pricingService.validatePromoCode(this.promoCodeInput).subscribe({
      next: (response) => {
        this.isValidatingPromo.set(false);
        this.promoMessage.set(response.message);
        if (response.valid) {
          this.updatePriceCalculation();
        }
      },
      error: () => {
        this.isValidatingPromo.set(false);
        this.promoMessage.set('Error validating promo code');
      }
    });
  }

  clearPromo(): void {
    this.pricingService.clearPromoCode();
    this.promoCodeInput = '';
    this.promoMessage.set(null);
    this.updatePriceCalculation();
  }

  formatPrice(price: number): string {
    return this.pricingService.formatPrice(price);
  }

  onPrevious(): void {
    this.previous.emit();
  }

  onSubmit(): void {
    if (!this.termsAccepted) return;

    this.isSubmitting.set(true);

    // Get current pricing breakdown
    const currentBreakdown = this.breakdown();

    // Save review step data with pricing
    this.submissionService.saveReview({
      selectedExtras: this.selectedExtras(),
      promoCode: this.appliedPromoCode() || undefined,
      promoCodeValid: !!this.appliedPromoCode(),
      termsAccepted: true,
      pricingBreakdown: currentBreakdown || undefined,
      estimatedPrice: currentBreakdown?.finalPrice || 0
    }).subscribe({
      next: () => {
        this.stepComplete.emit();
        this.submit.emit();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        console.error('Error saving review:', err);
      }
    });
  }
}
