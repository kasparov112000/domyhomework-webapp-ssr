import { Component, Output, EventEmitter, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime } from 'rxjs';

import { PaperSubmissionService } from '../../../services/paper-submission.service';
import { PricingService } from '../../../services/pricing.service';
import {
  SERVICE_TYPE_OPTIONS,
  ACADEMIC_LEVEL_OPTIONS,
  DEADLINE_OPTIONS,
  PROJECT_PURPOSE_OPTIONS,
  PAPER_TYPE_OPTIONS,
  ServiceType,
  AcademicLevel,
  DeadlineUrgency
} from '../../../models/paper-submission.model';

@Component({
  selector: 'app-key-details-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="key-details-step">
      <form [formGroup]="form" class="details-form">
        <!-- Service Type -->
        <div class="form-section">
          <h3>What do you need?</h3>
          <div class="radio-cards">
            @for (option of serviceOptions; track option.value) {
              <label
                class="radio-card"
                [class.selected]="form.get('serviceType')?.value === option.value"
              >
                <input
                  type="radio"
                  formControlName="serviceType"
                  [value]="option.value"
                >
                <span class="card-content">
                  <span class="card-label">{{ option.label }}</span>
                  @if (getServiceMultiplierText(option.value); as text) {
                    <span class="card-badge" [class.discount]="text.includes('Save')">{{ text }}</span>
                  }
                </span>
              </label>
            }
          </div>
        </div>

        <!-- Academic Level -->
        <div class="form-section">
          <h3>Academic Level</h3>
          <div class="select-group">
            <select formControlName="academicLevel">
              <option value="" disabled>Select academic level</option>
              @for (option of academicOptions; track option.value) {
                <option [value]="option.value">
                  {{ option.label }} ({{ formatPrice(getBasePriceForLevel(option.value)) }}/page)
                </option>
              }
            </select>
          </div>
        </div>

        <!-- Subject Area -->
        <div class="form-section">
          <h3>Subject Area</h3>
          <div class="select-group">
            <select formControlName="subjectArea">
              <option value="" disabled>Select subject area</option>
              @for (subject of subjectAreas(); track subject.id) {
                <option [value]="subject.id">{{ subject.name }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Number of Pages -->
        <div class="form-section">
          <h3>Number of Pages</h3>
          <div class="number-input">
            <button type="button" class="decrement" (click)="decrementPages()" [disabled]="form.get('numberOfPages')?.value <= 1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
            </button>
            <input
              type="number"
              formControlName="numberOfPages"
              min="1"
              max="500"
            >
            <button type="button" class="increment" (click)="incrementPages()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>
          <p class="helper-text">Approximately {{ wordCount() }} words (275 words per page)</p>
        </div>

        <!-- Deadline -->
        <div class="form-section">
          <h3>Deadline</h3>
          <div class="deadline-options">
            @for (option of deadlineOptions; track option.value) {
              <label
                class="deadline-option"
                [class.selected]="form.get('deadlineUrgency')?.value === option.value"
              >
                <input
                  type="radio"
                  formControlName="deadlineUrgency"
                  [value]="option.value"
                >
                <span class="option-content">
                  <span class="option-label">{{ option.label }}</span>
                  @if (getDeadlineSavings(option.value); as savings) {
                    <span class="option-badge" [class.discount]="savings.includes('Save')">{{ savings }}</span>
                  }
                </span>
              </label>
            }
          </div>
          @if (calculatedDeadline()) {
            <p class="deadline-info">
              Due by: <strong>{{ calculatedDeadline() | date:'medium' }}</strong>
            </p>
          }
        </div>

        <!-- Paper Type -->
        <div class="form-section">
          <h3>Paper Type</h3>
          <div class="select-group">
            <select formControlName="paperType">
              <option value="" disabled>Select paper type</option>
              @for (option of paperTypeOptions; track option.value) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Project Purpose -->
        <div class="form-section">
          <h3>Purpose</h3>
          <div class="radio-inline">
            @for (option of purposeOptions; track option.value) {
              <label class="radio-item">
                <input
                  type="radio"
                  formControlName="projectPurpose"
                  [value]="option.value"
                >
                <span>{{ option.label }}</span>
              </label>
            }
          </div>
        </div>

        <!-- Expert Preference -->
        <div class="form-section expert-section">
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                [checked]="expertEnabled()"
                (change)="toggleExpert($event)"
              >
              <span class="checkbox-text">
                <strong>Request Best Expert</strong>
                <span class="checkbox-description">Get the top-rated expert in your field</span>
              </span>
            </label>
          </div>

          @if (expertEnabled()) {
            <div class="specialty-input">
              <input
                type="text"
                [value]="expertSpecialty()"
                (input)="updateSpecialty($event)"
                placeholder="Specify specialty (optional)"
              >
            </div>
          }
        </div>

        <!-- Price Display -->
        <div class="price-preview">
          <div class="price-label">Estimated Price</div>
          <div class="price-value">{{ formatPrice(estimatedPrice()) }}</div>
          <div class="price-per-page">{{ formatPrice(pricePerPage()) }}/page</div>
        </div>
      </form>

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
          class="btn-primary"
          (click)="onNext()"
          [disabled]="form.invalid"
        >
          Continue
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .key-details-step {
      max-width: 640px;
      margin: 0 auto;
    }

    .details-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.75rem 0;
    }

    /* Radio Cards */
    .radio-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    @media (min-width: 640px) {
      .radio-cards {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .radio-card {
      position: relative;
      cursor: pointer;
    }

    .radio-card input {
      position: absolute;
      opacity: 0;
    }

    .radio-card .card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      text-align: center;
    }

    .radio-card:hover .card-content {
      border-color: #a5b4fc;
    }

    .radio-card.selected .card-content {
      border-color: #6366f1;
      background: #eef2ff;
    }

    .card-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .card-badge {
      font-size: 0.6875rem;
      padding: 0.125rem 0.5rem;
      border-radius: 1rem;
      background: #f3f4f6;
      color: #6b7280;
      margin-top: 0.25rem;
    }

    .card-badge.discount {
      background: #dcfce7;
      color: #166534;
    }

    /* Select Group */
    .select-group select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      color: #1f2937;
      background: #fff;
      cursor: pointer;
    }

    .select-group select:focus {
      outline: none;
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    /* Number Input */
    .number-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      max-width: 200px;
    }

    .number-input button {
      width: 2.5rem;
      height: 2.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .number-input button:hover:not(:disabled) {
      background: #f3f4f6;
    }

    .number-input button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .number-input button svg {
      width: 1.25rem;
      height: 1.25rem;
      color: #374151;
    }

    .number-input input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      text-align: center;
      -moz-appearance: textfield;
    }

    .number-input input::-webkit-outer-spin-button,
    .number-input input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .helper-text {
      font-size: 0.8125rem;
      color: #6b7280;
      margin-top: 0.5rem;
    }

    /* Deadline Options */
    .deadline-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
    }

    @media (min-width: 640px) {
      .deadline-options {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    .deadline-option {
      cursor: pointer;
    }

    .deadline-option input {
      position: absolute;
      opacity: 0;
    }

    .deadline-option .option-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.75rem 0.5rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      text-align: center;
    }

    .deadline-option:hover .option-content {
      border-color: #a5b4fc;
    }

    .deadline-option.selected .option-content {
      border-color: #6366f1;
      background: #eef2ff;
    }

    .option-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: #374151;
    }

    .option-badge {
      font-size: 0.625rem;
      padding: 0.125rem 0.375rem;
      border-radius: 1rem;
      background: #fef3c7;
      color: #92400e;
      margin-top: 0.25rem;
    }

    .option-badge.discount {
      background: #dcfce7;
      color: #166534;
    }

    .deadline-info {
      font-size: 0.875rem;
      color: #4b5563;
      margin-top: 0.75rem;
    }

    .deadline-info strong {
      color: #1f2937;
    }

    /* Radio Inline */
    .radio-inline {
      display: flex;
      gap: 1.5rem;
    }

    .radio-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .radio-item input[type="radio"] {
      width: 1.125rem;
      height: 1.125rem;
      accent-color: #6366f1;
    }

    .radio-item span {
      font-size: 0.9375rem;
      color: #374151;
    }

    /* Checkbox Group */
    .expert-section {
      padding: 1rem;
      background: #f8fafc;
      border-radius: 0.5rem;
    }

    .checkbox-group {
      display: flex;
      align-items: flex-start;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      cursor: pointer;
    }

    .checkbox-label input[type="checkbox"] {
      width: 1.25rem;
      height: 1.25rem;
      margin-top: 0.125rem;
      accent-color: #6366f1;
    }

    .checkbox-text {
      display: flex;
      flex-direction: column;
    }

    .checkbox-text strong {
      color: #1f2937;
      font-size: 0.9375rem;
    }

    .checkbox-description {
      font-size: 0.8125rem;
      color: #6b7280;
    }

    .specialty-input {
      margin-top: 1rem;
    }

    .specialty-input input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
    }

    /* Price Preview */
    .price-preview {
      padding: 1.5rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      border-radius: 0.75rem;
      text-align: center;
      color: #fff;
    }

    .price-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .price-value {
      font-size: 2rem;
      font-weight: 700;
      margin: 0.25rem 0;
    }

    .price-per-page {
      font-size: 0.8125rem;
      opacity: 0.8;
    }

    /* Navigation */
    .step-navigation {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
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
      border-color: #9ca3af;
    }

    .btn-secondary svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #4f46e5, #4338ca);
      transform: translateY(-1px);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  `]
})
export class KeyDetailsStepComponent implements OnInit, OnDestroy {
  @Output() stepComplete = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private submissionService = inject(PaperSubmissionService);
  private pricingService = inject(PricingService);
  private destroy$ = new Subject<void>();

  // Options
  serviceOptions = SERVICE_TYPE_OPTIONS;
  academicOptions = ACADEMIC_LEVEL_OPTIONS;
  deadlineOptions = DEADLINE_OPTIONS;
  purposeOptions = PROJECT_PURPOSE_OPTIONS;
  paperTypeOptions = PAPER_TYPE_OPTIONS;

  // State
  expertEnabled = signal(false);
  expertSpecialty = signal('');

  // From pricing service
  readonly subjectAreas = this.pricingService.subjectAreas;

  // Form
  form: FormGroup = this.fb.group({
    serviceType: ['writing', Validators.required],
    academicLevel: ['undergraduate', Validators.required],
    subjectArea: ['', Validators.required],
    numberOfPages: [1, [Validators.required, Validators.min(1)]],
    deadlineUrgency: ['7days', Validators.required],
    projectPurpose: ['academic', Validators.required],
    paperType: ['essay', Validators.required]
  });

  // Computed values
  wordCount = computed(() => {
    const pages = this.form.get('numberOfPages')?.value || 1;
    return pages * 275;
  });

  calculatedDeadline = computed(() => {
    const urgency = this.form.get('deadlineUrgency')?.value;
    const option = this.deadlineOptions.find(o => o.value === urgency);
    if (!option) return null;
    return new Date(Date.now() + option.hours * 60 * 60 * 1000);
  });

  pricePerPage = computed(() => {
    const level = this.form.get('academicLevel')?.value as AcademicLevel;
    const service = this.form.get('serviceType')?.value as ServiceType;
    const deadline = this.form.get('deadlineUrgency')?.value as DeadlineUrgency;

    const basePrice = this.pricingService.getBasePriceForLevel(level);
    const deadlineMultiplier = this.pricingService.getDeadlineMultiplier(deadline);
    const serviceMultiplier = this.pricingService.getServiceMultiplier(service);

    return basePrice * deadlineMultiplier * serviceMultiplier;
  });

  estimatedPrice = computed(() => {
    const pages = this.form.get('numberOfPages')?.value || 1;
    return this.pricePerPage() * pages;
  });

  ngOnInit(): void {
    // Load existing submission data if available
    const submission = this.submissionService.currentSubmission();
    if (submission) {
      this.populateForm(submission);
    }

    // Subscribe to form changes for auto-save
    this.form.valueChanges.pipe(
      debounceTime(1000),
      takeUntil(this.destroy$)
    ).subscribe(values => {
      this.submissionService.triggerAutoSave({
        ...values,
        expertPreference: {
          enabled: this.expertEnabled(),
          specialty: this.expertSpecialty()
        }
      });

      // Update local price calculation
      this.updatePriceCalculation();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private populateForm(submission: any): void {
    if (submission.serviceType) {
      this.form.patchValue({
        serviceType: submission.serviceType,
        academicLevel: submission.academicLevel || 'undergraduate',
        subjectArea: submission.subjectArea || '',
        numberOfPages: submission.numberOfPages || 1,
        deadlineUrgency: submission.deadlineUrgency || '7days',
        projectPurpose: submission.projectPurpose || 'academic',
        paperType: submission.paperType || 'essay'
      }, { emitEvent: false });
    }

    if (submission.expertPreference) {
      this.expertEnabled.set(submission.expertPreference.enabled || false);
      this.expertSpecialty.set(submission.expertPreference.specialty || '');
    }
  }

  private updatePriceCalculation(): void {
    const values = this.form.value;
    this.pricingService.calculatePriceLocally(
      values.academicLevel,
      values.serviceType,
      values.deadlineUrgency,
      values.numberOfPages,
      0, // sources will be added in next step
      []  // extras will be added in review step
    );
  }

  incrementPages(): void {
    const current = this.form.get('numberOfPages')?.value || 1;
    this.form.patchValue({ numberOfPages: current + 1 });
  }

  decrementPages(): void {
    const current = this.form.get('numberOfPages')?.value || 1;
    if (current > 1) {
      this.form.patchValue({ numberOfPages: current - 1 });
    }
  }

  toggleExpert(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.expertEnabled.set(checked);
  }

  updateSpecialty(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.expertSpecialty.set(value);
  }

  getBasePriceForLevel(level: AcademicLevel): number {
    return this.pricingService.getBasePriceForLevel(level);
  }

  getServiceMultiplierText(type: ServiceType): string | null {
    const multiplier = this.pricingService.getServiceMultiplier(type);
    if (multiplier < 1) {
      const savings = Math.round((1 - multiplier) * 100);
      return `Save ${savings}%`;
    }
    return null;
  }

  getDeadlineSavings(urgency: DeadlineUrgency): string | null {
    return this.pricingService.getDeadlineSavings(urgency);
  }

  formatPrice(price: number): string {
    return this.pricingService.formatPrice(price);
  }

  onPrevious(): void {
    this.previous.emit();
  }

  onNext(): void {
    if (this.form.valid) {
      // Save step data
      const stepData = {
        ...this.form.value,
        deadline: this.calculatedDeadline(),
        expertPreference: {
          enabled: this.expertEnabled(),
          specialty: this.expertSpecialty()
        }
      };

      console.log('[KeyDetailsStep] Saving step data:', JSON.stringify(stepData, null, 2));

      this.submissionService.saveKeyDetails(stepData).subscribe({
        next: (response) => {
          console.log('[KeyDetailsStep] Save response:', response);
          this.stepComplete.emit();
          this.next.emit();
        },
        error: (err) => {
          console.error('[KeyDetailsStep] Error saving key details:', err);
        }
      });
    } else {
      console.log('[KeyDetailsStep] Form invalid:', this.form.errors);
    }
  }
}
