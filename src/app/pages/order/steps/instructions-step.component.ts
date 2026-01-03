import { Component, Output, EventEmitter, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime } from 'rxjs';

import { PaperSubmissionService } from '../../../services/paper-submission.service';
import { PricingService } from '../../../services/pricing.service';
import { CITATION_STYLE_OPTIONS, UploadedDocument } from '../../../models/paper-submission.model';

@Component({
  selector: 'app-instructions-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="instructions-step">
      <form [formGroup]="form" class="instructions-form">
        <!-- Title -->
        <div class="form-section">
          <label for="title">Paper Title <span class="required">*</span></label>
          <input
            id="title"
            type="text"
            formControlName="title"
            placeholder="Enter the title of your paper"
            [class.error]="form.get('title')?.invalid && form.get('title')?.touched"
          >
          @if (form.get('title')?.invalid && form.get('title')?.touched) {
            <span class="error-text">Title is required</span>
          }
        </div>

        <!-- Instructions -->
        <div class="form-section">
          <label for="instructions">Detailed Instructions <span class="required">*</span></label>
          <textarea
            id="instructions"
            formControlName="instructions"
            placeholder="Please provide detailed instructions for your paper. Include:
- Topic and thesis statement
- Key points to cover
- Specific requirements from your professor
- Any formatting requirements not covered by citation style
- Anything else the writer should know"
            rows="8"
            [class.error]="form.get('instructions')?.invalid && form.get('instructions')?.touched"
          ></textarea>
          <div class="char-counter" [class.warning]="instructionsLength() < 50">
            {{ instructionsLength() }} characters
            @if (instructionsLength() < 50) {
              <span>(minimum 50 recommended)</span>
            }
          </div>
          @if (form.get('instructions')?.invalid && form.get('instructions')?.touched) {
            <span class="error-text">Instructions are required</span>
          }
        </div>

        <!-- File Upload -->
        <div class="form-section">
          <label>Attachments (optional)</label>
          <div
            class="file-upload-area"
            [class.dragover]="isDragOver()"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
          >
            <div class="upload-content">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
              </svg>
              <p>Drag and drop files here, or <button type="button" (click)="fileInput.click()">browse</button></p>
              <span class="file-types">PDF, DOC, DOCX, TXT, Images (max 10MB each)</span>
            </div>
            <input
              #fileInput
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              (change)="onFileSelect($event)"
              hidden
            >
          </div>

          <!-- Uploaded Files -->
          @if (uploadedFiles().length > 0) {
            <div class="uploaded-files">
              @for (file of uploadedFiles(); track file.id) {
                <div class="file-item">
                  <div class="file-info">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-size">{{ formatFileSize(file.size) }}</span>
                  </div>
                  <button type="button" class="remove-btn" (click)="removeFile(file.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <!-- Citation Style -->
        <div class="form-section">
          <label for="citationStyle">Citation Style</label>
          <div class="select-group">
            <select id="citationStyle" formControlName="citationStyle">
              @for (option of citationOptions; track option.value) {
                <option [value]="option.value">{{ option.label }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Number of Sources -->
        <div class="form-section">
          <label>Number of Sources Required</label>
          <div class="number-input">
            <button type="button" class="decrement" (click)="decrementSources()" [disabled]="form.get('numberOfSources')?.value <= 0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
            </button>
            <input
              type="number"
              formControlName="numberOfSources"
              min="0"
              max="100"
            >
            <button type="button" class="increment" (click)="incrementSources()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
            </button>
          </div>
          <p class="helper-text">
            @if (sourceCost() > 0) {
              {{ formatPrice(sourceCost()) }} per source
              @if (form.get('numberOfSources')?.value > 0) {
                ({{ formatPrice(form.get('numberOfSources')?.value * sourceCost()) }} total)
              }
            }
          </p>
        </div>

        <!-- Additional Notes -->
        <div class="form-section">
          <label for="additionalNotes">Additional Notes (optional)</label>
          <textarea
            id="additionalNotes"
            formControlName="additionalNotes"
            placeholder="Any other information you'd like to add..."
            rows="4"
          ></textarea>
        </div>
      </form>

      <!-- Error Message -->
      @if (saveError()) {
        <div class="error-banner">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {{ saveError() }}
        </div>
      }

      <!-- Navigation -->
      <div class="step-navigation">
        <button type="button" class="btn-secondary" (click)="onPrevious()" [disabled]="isSaving()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Back
        </button>
        <button
          type="button"
          class="btn-primary"
          (click)="onNext()"
          [disabled]="form.invalid || isSaving()"
        >
          @if (isSaving()) {
            <span class="spinner"></span> Saving...
          } @else {
            Continue to Review
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    .instructions-step {
      max-width: 640px;
      margin: 0 auto;
    }

    .instructions-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-section label {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #1f2937;
    }

    /* Required indicator */
    .required {
      color: #dc2626;
      font-weight: 500;
    }

    .form-section input[type="text"],
    .form-section textarea {
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.2s ease;
    }

    .form-section input:focus,
    .form-section textarea:focus {
      outline: none;
      border-color: #D04A02;
      box-shadow: 0 0 0 3px rgba(208, 74, 2, 0.1);
    }

    .form-section input.error,
    .form-section textarea.error {
      border-color: #ef4444;
    }

    .error-text {
      font-size: 0.75rem;
      color: #ef4444;
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }

    .char-counter {
      font-size: 0.75rem;
      color: #6b7280;
      text-align: right;
    }

    .char-counter.warning {
      color: #d97706;
    }

    .char-counter span {
      margin-left: 0.5rem;
    }

    /* File Upload */
    .file-upload-area {
      border: 2px dashed #d1d5db;
      border-radius: 0.5rem;
      padding: 2rem;
      text-align: center;
      transition: all 0.2s ease;
    }

    .file-upload-area.dragover {
      border-color: #D04A02;
      background: #fef5f0;
    }

    .upload-content svg {
      width: 3rem;
      height: 3rem;
      color: #9ca3af;
      margin-bottom: 1rem;
    }

    .upload-content p {
      color: #4b5563;
      margin: 0 0 0.5rem 0;
    }

    .upload-content button {
      background: none;
      border: none;
      color: #D04A02;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
    }

    .upload-content button:hover {
      text-decoration: underline;
    }

    .file-types {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .uploaded-files {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .file-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .file-info svg {
      width: 1.5rem;
      height: 1.5rem;
      color: #D04A02;
    }

    .file-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: #1f2937;
    }

    .file-size {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .remove-btn {
      width: 2rem;
      height: 2rem;
      border: none;
      background: transparent;
      border-radius: 0.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .remove-btn:hover {
      background: #fee2e2;
    }

    .remove-btn svg {
      width: 1.25rem;
      height: 1.25rem;
      color: #ef4444;
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
      border-color: #D04A02;
      box-shadow: 0 0 0 3px rgba(208, 74, 2, 0.1);
    }

    /* Number Input */
    .number-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      max-width: 180px;
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
      background: linear-gradient(135deg, #D04A02, #B03902);
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #B03902, #8F2E01);
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

    /* Error Banner */
    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #fef2f2;
      border: 1px solid #fee2e2;
      border-radius: 0.5rem;
      color: #dc2626;
      font-size: 0.9375rem;
      margin-bottom: 1rem;
    }

    .error-banner svg {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    /* Spinner */
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
export class InstructionsStepComponent implements OnInit, OnDestroy {
  @Output() stepComplete = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private submissionService = inject(PaperSubmissionService);
  private pricingService = inject(PricingService);
  private destroy$ = new Subject<void>();

  // Options
  citationOptions = CITATION_STYLE_OPTIONS;

  // State
  isDragOver = signal(false);
  uploadedFiles = signal<UploadedDocument[]>([]);
  saveError = signal<string | null>(null);
  isSaving = signal(false);

  // From pricing service
  readonly sourceCost = () => this.pricingService.config()?.sourceCost || 5;

  // Form
  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    instructions: ['', Validators.required],
    citationStyle: ['apa'],
    numberOfSources: [0, [Validators.required, Validators.min(0)]],
    additionalNotes: ['']
  });

  // Computed
  instructionsLength = () => (this.form.get('instructions')?.value || '').length;

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
        documents: this.uploadedFiles()
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private populateForm(submission: any): void {
    if (submission.title || submission.instructions) {
      this.form.patchValue({
        title: submission.title || '',
        instructions: submission.instructions || '',
        citationStyle: submission.citationStyle || 'apa',
        numberOfSources: submission.numberOfSources || 0,
        additionalNotes: submission.additionalNotes || ''
      }, { emitEvent: false });
    }

    if (submission.documents) {
      this.uploadedFiles.set(submission.documents);
    }
  }

  // File handling
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
      input.value = ''; // Reset input
    }
  }

  private handleFiles(files: File[]): void {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    const currentFiles = this.uploadedFiles();

    files.forEach(file => {
      if (!validTypes.includes(file.type)) {
        console.warn('Invalid file type:', file.type);
        return;
      }

      if (file.size > maxSize) {
        console.warn('File too large:', file.name);
        return;
      }

      // Check for duplicates
      if (currentFiles.some(f => f.name === file.name && f.size === file.size)) {
        return;
      }

      const newFile: UploadedDocument = {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date()
      };

      this.uploadedFiles.update(files => [...files, newFile]);

      // TODO: Actually upload file to server
      // this.uploadFile(file, newFile.id);
    });
  }

  removeFile(id: string): void {
    this.uploadedFiles.update(files => files.filter(f => f.id !== id));
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  incrementSources(): void {
    const current = this.form.get('numberOfSources')?.value || 0;
    this.form.patchValue({ numberOfSources: current + 1 });
  }

  decrementSources(): void {
    const current = this.form.get('numberOfSources')?.value || 0;
    if (current > 0) {
      this.form.patchValue({ numberOfSources: current - 1 });
    }
  }

  formatPrice(price: number): string {
    return this.pricingService.formatPrice(price);
  }

  onPrevious(): void {
    this.previous.emit();
  }

  onNext(): void {
    if (this.form.valid) {
      this.saveError.set(null);
      this.isSaving.set(true);

      const stepData = {
        ...this.form.value,
        documents: this.uploadedFiles()
      };

      this.submissionService.saveInstructions(stepData).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.stepComplete.emit();
          this.next.emit();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.saveError.set(err.message || 'Failed to save. Please try again.');
          console.error('Error saving instructions:', err);
        }
      });
    } else {
      // Mark all fields as touched to trigger validation display
      this.form.markAllAsTouched();
      this.saveError.set('Please fill in all required fields');
    }
  }
}
