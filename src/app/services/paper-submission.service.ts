import { Injectable, PLATFORM_ID, Inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, throwError, BehaviorSubject, Subject } from 'rxjs';
import { tap, catchError, map, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import {
  PaperSubmission,
  ApiResponse,
  StepperState,
  KeyDetailsStepData,
  InstructionsStepData,
  ReviewStepData
} from '../models/paper-submission.model';

/**
 * PaperSubmissionService - Handles paper submission operations
 * Manages draft auto-save, step tracking, and submission lifecycle
 */
@Injectable({
  providedIn: 'root'
})
export class PaperSubmissionService {
  private isBrowser: boolean;
  private baseUrl: string;

  // Auto-save subject for debouncing
  private autoSaveSubject = new Subject<Partial<PaperSubmission>>();

  // Reactive state using signals
  private _currentSubmission = signal<PaperSubmission | null>(null);
  private _stepperState = signal<StepperState>({
    currentStep: 0,
    completedSteps: [],
    isLoading: false,
    isSaving: false
  });
  private _userSubmissions = signal<PaperSubmission[]>([]);

  // Public computed signals
  readonly currentSubmission = computed(() => this._currentSubmission());
  readonly stepperState = computed(() => this._stepperState());
  readonly userSubmissions = computed(() => this._userSubmissions());
  readonly currentStep = computed(() => this._stepperState().currentStep);
  readonly isLoading = computed(() => this._stepperState().isLoading);
  readonly isSaving = computed(() => this._stepperState().isSaving);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.baseUrl = this.getApiBaseUrl();

    // Setup auto-save with debounce (2 seconds)
    this.autoSaveSubject.pipe(
      debounceTime(2000),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      switchMap(data => this.saveSubmission(data))
    ).subscribe();
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

  // ===== SUBMISSION CRUD OPERATIONS =====

  /**
   * Create a new paper submission draft
   */
  createSubmission(userId: string): Observable<ApiResponse<PaperSubmission>> {
    this.updateStepperState({ isLoading: true });

    const initialData: Partial<PaperSubmission> = {
      userId,
      createdByGuid: userId,
      currentStep: 0,
      completedSteps: [],
      isDraft: true
    };

    return this.http.post<ApiResponse<PaperSubmission>>(
      `${this.baseUrl}/submissions`,
      initialData,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._currentSubmission.set(response.result);
          this.updateStepperState({
            submissionId: response.result._id,
            isLoading: false
          });
          console.log('[PaperSubmissionService] Created new submission:', response.result._id);
        }
      }),
      catchError(error => {
        this.updateStepperState({ isLoading: false, error: error.message });
        console.error('[PaperSubmissionService] Error creating submission:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a submission by ID
   */
  getSubmission(id: string): Observable<ApiResponse<PaperSubmission>> {
    this.updateStepperState({ isLoading: true });

    return this.http.get<ApiResponse<PaperSubmission>>(
      `${this.baseUrl}/submissions/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._currentSubmission.set(response.result);
          this.updateStepperState({
            submissionId: response.result._id,
            currentStep: response.result.currentStep || 0,
            completedSteps: response.result.completedSteps || [],
            lastSavedAt: response.result.lastSavedAt ? new Date(response.result.lastSavedAt) : undefined,
            isLoading: false
          });
        }
      }),
      catchError(error => {
        this.updateStepperState({ isLoading: false, error: error.message });
        console.error('[PaperSubmissionService] Error fetching submission:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all submissions for a user
   */
  getUserSubmissions(userId: string): Observable<ApiResponse<PaperSubmission[]>> {
    this.updateStepperState({ isLoading: true });

    return this.http.get<ApiResponse<PaperSubmission[]>>(
      `${this.baseUrl}/submissions/user/${userId}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._userSubmissions.set(response.result);
        }
        this.updateStepperState({ isLoading: false });
      }),
      catchError(error => {
        this.updateStepperState({ isLoading: false, error: error.message });
        console.error('[PaperSubmissionService] Error fetching user submissions:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update a submission (full update)
   */
  updateSubmission(id: string, data: Partial<PaperSubmission>): Observable<ApiResponse<PaperSubmission>> {
    this.updateStepperState({ isSaving: true });

    return this.http.put<ApiResponse<PaperSubmission>>(
      `${this.baseUrl}/submissions/${id}`,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._currentSubmission.set(response.result);
          this.updateStepperState({
            lastSavedAt: new Date(),
            isSaving: false
          });
          console.log('[PaperSubmissionService] Submission updated:', id);
        }
      }),
      catchError(error => {
        this.updateStepperState({ isSaving: false, error: error.message });
        console.error('[PaperSubmissionService] Error updating submission:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update a specific step in the submission
   */
  updateStep(id: string, stepNumber: number, data: Partial<PaperSubmission>): Observable<ApiResponse<PaperSubmission>> {
    this.updateStepperState({ isSaving: true });

    const url = `${this.baseUrl}/submissions/${id}/step/${stepNumber}`;
    console.log('[PaperSubmissionService] PUT', url);
    console.log('[PaperSubmissionService] Request body:', JSON.stringify(data, null, 2));

    return this.http.put<ApiResponse<PaperSubmission>>(
      url,
      data,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._currentSubmission.set(response.result);

          // Update stepper state with new completed steps
          const completedSteps = [...this._stepperState().completedSteps];
          if (!completedSteps.includes(stepNumber)) {
            completedSteps.push(stepNumber);
            completedSteps.sort((a, b) => a - b);
          }

          this.updateStepperState({
            currentStep: Math.max(stepNumber + 1, this._stepperState().currentStep),
            completedSteps,
            lastSavedAt: new Date(),
            isSaving: false
          });

          console.log('[PaperSubmissionService] Step updated:', stepNumber);
        }
      }),
      catchError(error => {
        this.updateStepperState({ isSaving: false, error: error.message });
        console.error('[PaperSubmissionService] Error updating step:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Submit the paper (finalize)
   */
  submitPaper(id: string, termsAccepted: boolean): Observable<ApiResponse<PaperSubmission>> {
    this.updateStepperState({ isLoading: true });

    return this.http.post<ApiResponse<PaperSubmission>>(
      `${this.baseUrl}/submissions/${id}/submit`,
      { termsAccepted },
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.result) {
          this._currentSubmission.set(response.result);
          this.updateStepperState({ isLoading: false });
          console.log('[PaperSubmissionService] Paper submitted:', id);
        }
      }),
      catchError(error => {
        this.updateStepperState({ isLoading: false, error: error.message });
        console.error('[PaperSubmissionService] Error submitting paper:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a draft submission
   */
  deleteSubmission(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/submissions/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success) {
          // Remove from user submissions list
          const submissions = this._userSubmissions().filter(s => s._id !== id);
          this._userSubmissions.set(submissions);

          // Clear current if it was deleted
          if (this._currentSubmission()?._id === id) {
            this._currentSubmission.set(null);
            this.resetStepperState();
          }

          console.log('[PaperSubmissionService] Submission deleted:', id);
        }
      }),
      catchError(error => {
        console.error('[PaperSubmissionService] Error deleting submission:', error);
        return throwError(() => error);
      })
    );
  }

  // ===== AUTO-SAVE OPERATIONS =====

  /**
   * Trigger auto-save (debounced)
   */
  triggerAutoSave(data: Partial<PaperSubmission>): void {
    const submissionId = this._stepperState().submissionId;
    if (submissionId) {
      this.autoSaveSubject.next({ ...data, _id: submissionId });
    }
  }

  /**
   * Save submission data (used by auto-save)
   */
  private saveSubmission(data: Partial<PaperSubmission>): Observable<ApiResponse<PaperSubmission>> {
    const id = data._id;
    if (!id) {
      return of({ success: false, error: 'No submission ID' } as ApiResponse<PaperSubmission>);
    }

    delete data._id;
    return this.updateSubmission(id, data);
  }

  // ===== STEP-SPECIFIC SAVE METHODS =====

  /**
   * Save Key Details step data
   */
  saveKeyDetails(data: KeyDetailsStepData): Observable<ApiResponse<PaperSubmission>> {
    const submissionId = this._stepperState().submissionId;
    if (!submissionId) {
      return throwError(() => new Error('No active submission'));
    }

    return this.updateStep(submissionId, 1, data);
  }

  /**
   * Save Instructions step data
   */
  saveInstructions(data: InstructionsStepData): Observable<ApiResponse<PaperSubmission>> {
    const submissionId = this._stepperState().submissionId;
    if (!submissionId) {
      return throwError(() => new Error('No active submission'));
    }

    return this.updateStep(submissionId, 2, data);
  }

  /**
   * Save Review step data
   */
  saveReview(data: ReviewStepData): Observable<ApiResponse<PaperSubmission>> {
    const submissionId = this._stepperState().submissionId;
    if (!submissionId) {
      return throwError(() => new Error('No active submission'));
    }

    return this.updateStep(submissionId, 3, data);
  }

  // ===== STEPPER NAVIGATION =====

  /**
   * Go to a specific step
   */
  goToStep(step: number): void {
    const state = this._stepperState();
    // Can only go to completed steps or the next step after the last completed
    const maxStep = Math.max(...state.completedSteps, -1) + 1;
    if (step <= maxStep && step >= 0) {
      this.updateStepperState({ currentStep: step });
    }
  }

  /**
   * Go to next step
   */
  nextStep(): void {
    const currentStep = this._stepperState().currentStep;
    if (currentStep < 3) {
      this.updateStepperState({ currentStep: currentStep + 1 });
    }
  }

  /**
   * Go to previous step
   */
  previousStep(): void {
    const currentStep = this._stepperState().currentStep;
    if (currentStep > 0) {
      this.updateStepperState({ currentStep: currentStep - 1 });
    }
  }

  /**
   * Mark step as completed
   */
  completeStep(step: number): void {
    const completedSteps = [...this._stepperState().completedSteps];
    if (!completedSteps.includes(step)) {
      completedSteps.push(step);
      completedSteps.sort((a, b) => a - b);
      this.updateStepperState({ completedSteps });
    }
  }

  /**
   * Check if a step is completed
   */
  isStepCompleted(step: number): boolean {
    return this._stepperState().completedSteps.includes(step);
  }

  /**
   * Check if can navigate to a step
   */
  canNavigateToStep(step: number): boolean {
    const state = this._stepperState();
    const maxStep = Math.max(...state.completedSteps, -1) + 1;
    return step <= maxStep;
  }

  // ===== STATE MANAGEMENT =====

  /**
   * Update stepper state
   */
  private updateStepperState(updates: Partial<StepperState>): void {
    this._stepperState.set({
      ...this._stepperState(),
      ...updates
    });
  }

  /**
   * Reset stepper state
   */
  resetStepperState(): void {
    this._stepperState.set({
      currentStep: 0,
      completedSteps: [],
      isLoading: false,
      isSaving: false
    });
  }

  /**
   * Clear current submission
   */
  clearCurrentSubmission(): void {
    this._currentSubmission.set(null);
    this.resetStepperState();
  }

  // ===== HELPERS =====

  /**
   * Get HTTP headers
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Resume a draft submission
   */
  resumeSubmission(id: string): Observable<ApiResponse<PaperSubmission>> {
    return this.getSubmission(id);
  }

  /**
   * Check if there's an active draft for a user
   */
  hasActiveDraft(userId: string): Observable<boolean> {
    return this.getUserSubmissions(userId).pipe(
      map(response => {
        if (response.success && response.result) {
          return response.result.some(s => s.isDraft);
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  /**
   * Reset state for starting a new order
   */
  resetState(): void {
    this._currentSubmission.set(null);
    this._stepperState.set({
      currentStep: 0,
      completedSteps: [],
      isLoading: false,
      isSaving: false
    });
  }
}
