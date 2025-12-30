import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PaperSubmissionService } from '../../services/paper-submission.service';
import { PricingService } from '../../services/pricing.service';
import { AuthService } from '../../services/auth/auth.service';
import { STEP_LABELS, STEP_DESCRIPTIONS } from '../../models/paper-submission.model';

// Step Components
import { WelcomeStepComponent } from './steps/welcome-step.component';
import { KeyDetailsStepComponent } from './steps/key-details-step.component';
import { InstructionsStepComponent } from './steps/instructions-step.component';
import { ReviewStepComponent } from './steps/review-step.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    WelcomeStepComponent,
    KeyDetailsStepComponent,
    InstructionsStepComponent,
    ReviewStepComponent
  ],
  template: `
    <div class="order-page">
      <!-- Progress Header -->
      <header class="stepper-header">
        <div class="stepper-container">
          <!-- Stepper Progress -->
          <div class="stepper-progress">
            @for (step of stepLabels; track step; let i = $index) {
              <div
                class="step-item"
                [class.active]="currentStep() === i"
                [class.completed]="isStepCompleted(i)"
                [class.clickable]="canNavigateToStep(i)"
                (click)="navigateToStep(i)"
              >
                <div class="step-number">
                  @if (isStepCompleted(i)) {
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  } @else {
                    {{ i + 1 }}
                  }
                </div>
                <span class="step-label">{{ step }}</span>
              </div>
              @if (i < stepLabels.length - 1) {
                <div class="step-connector" [class.completed]="isStepCompleted(i)"></div>
              }
            }
          </div>

          <!-- Save Status -->
          <div class="save-status">
            @if (isSaving()) {
              <span class="saving">
                <span class="spinner"></span> Saving...
              </span>
            } @else if (lastSavedAt()) {
              <span class="saved">Saved</span>
            }
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="order-content">
        <div class="content-container">
          <!-- Step Title -->
          <div class="step-header">
            <h1>{{ stepLabels[currentStep()] }}</h1>
            <p>{{ stepDescriptions[currentStep()] }}</p>
          </div>

          <!-- Step Content -->
          <div class="step-content">
            @if (isProcessingPayment()) {
              <!-- Payment Processing Screen -->
              <div class="payment-processing">
                <div class="processing-animation">
                  <div class="card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                  </div>
                  <div class="processing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <h2>Processing Your Payment</h2>
                <p>Please wait while we securely process your payment with our credit card provider.</p>
                <p class="processing-note">This may take a few moments. Please do not close or refresh this page.</p>
                <div class="security-badges">
                  <div class="badge">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                    </svg>
                    <span>Secure Payment</span>
                  </div>
                  <div class="badge">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                    <span>256-bit Encryption</span>
                  </div>
                </div>
              </div>
            } @else if (paymentComplete()) {
              <!-- Payment Complete / Order Confirmed -->
              <div class="order-complete">
                <div class="complete-icon success">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <h2>Payment Successful!</h2>
                <p class="success-message">Your payment has been processed and your order is confirmed.</p>
                <p class="order-id">Order #: {{ (submissionService.stepperState().submissionId ?? '').slice(-8).toUpperCase() }}</p>

                <div class="confirmation-details">
                  <h3>What happens next?</h3>
                  <div class="next-steps">
                    <div class="step-item">
                      <div class="step-num">1</div>
                      <div class="step-info">
                        <strong>Order Review</strong>
                        <p>Our team will review your requirements within the next hour.</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-num">2</div>
                      <div class="step-info">
                        <strong>Expert Assignment</strong>
                        <p>We'll match you with the best expert for your subject area.</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-num">3</div>
                      <div class="step-info">
                        <strong>Work Begins</strong>
                        <p>Your expert will start working on your paper right away.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p class="email-note">A confirmation email has been sent to your registered email address.</p>

                <div class="complete-actions">
                  <a routerLink="/my-orders" class="btn-primary">View My Orders</a>
                  <a routerLink="/order" [queryParams]="{new: 'true'}" class="btn-secondary">Place New Order</a>
                </div>
              </div>
            } @else if (isLoading()) {
              <div class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading...</p>
              </div>
            } @else {
              @switch (currentStep()) {
                @case (0) {
                  <app-welcome-step
                    (stepComplete)="onStepComplete(0)"
                    (next)="nextStep()"
                  />
                }
                @case (1) {
                  <app-key-details-step
                    (stepComplete)="onStepComplete(1)"
                    (next)="nextStep()"
                    (previous)="previousStep()"
                  />
                }
                @case (2) {
                  <app-instructions-step
                    (stepComplete)="onStepComplete(2)"
                    (next)="nextStep()"
                    (previous)="previousStep()"
                  />
                }
                @case (3) {
                  <app-review-step
                    (stepComplete)="onStepComplete(3)"
                    (submit)="onSubmit()"
                    (previous)="previousStep()"
                  />
                }
                @default {
                  <!-- Step 4+ means order was submitted (fallback) -->
                  <div class="order-complete">
                    <div class="complete-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <h2>Order Submitted!</h2>
                    <p>Your order has been successfully submitted. We'll get started right away.</p>
                    <p class="order-id">Order #: {{ (submissionService.stepperState().submissionId ?? '').slice(-8).toUpperCase() }}</p>
                    <div class="complete-actions">
                      <a routerLink="/my-orders" class="btn-primary">View My Orders</a>
                      <a routerLink="/order" [queryParams]="{new: 'true'}" class="btn-secondary">Place New Order</a>
                    </div>
                  </div>
                }
              }
            }
          </div>
        </div>

        <!-- Price Summary Sidebar (visible on steps 1-3) -->
        @if (currentStep() > 0 && currentBreakdown()) {
          <aside class="price-sidebar">
            <div class="price-card">
              <h3>Order Summary</h3>

              <div class="price-breakdown">
                <div class="price-row">
                  <span>Price per page</span>
                  <span>{{ formatPrice(currentBreakdown()!.pricePerPage) }}</span>
                </div>
                <div class="price-row">
                  <span>Pages</span>
                  <span>{{ formatPrice(currentBreakdown()!.pagesTotal) }}</span>
                </div>
                @if (currentBreakdown()!.sourcesTotal > 0) {
                  <div class="price-row">
                    <span>Sources</span>
                    <span>{{ formatPrice(currentBreakdown()!.sourcesTotal) }}</span>
                  </div>
                }
                @if (currentBreakdown()!.extrasTotal > 0) {
                  <div class="price-row">
                    <span>Extras</span>
                    <span>{{ formatPrice(currentBreakdown()!.extrasTotal) }}</span>
                  </div>
                }

                <div class="price-divider"></div>

                <div class="price-row subtotal">
                  <span>Subtotal</span>
                  <span>{{ formatPrice(currentBreakdown()!.subtotal) }}</span>
                </div>

                @if (currentBreakdown()!.discount > 0) {
                  <div class="price-row discount">
                    <span>Discount</span>
                    <span>-{{ formatPrice(currentBreakdown()!.discount) }}</span>
                  </div>
                }

                <div class="price-row total">
                  <span>Total</span>
                  <span class="total-price">{{ formatPrice(currentBreakdown()!.finalPrice) }}</span>
                </div>
              </div>

              <!-- Free Includes -->
              <div class="free-includes">
                <h4>Included FREE</h4>
                @for (item of freeIncludes(); track item.name) {
                  <div class="free-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                    <span>{{ item.name }}</span>
                    <span class="crossed-price">{{ formatPrice(item.displayPrice) }}</span>
                  </div>
                }
              </div>

              <!-- Guarantee Badge -->
              <div class="guarantee-badge">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                <span>{{ moneyBackDays() }}-Day Money Back Guarantee</span>
              </div>
            </div>
          </aside>
        }
      </main>

      <!-- Error Message -->
      @if (error()) {
        <div class="error-toast">
          <span>{{ error() }}</span>
          <button (click)="clearError()">Dismiss</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .order-page {
      min-height: 100vh;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
    }

    /* Stepper Header */
    .stepper-header {
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .stepper-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
    }

    /* Stepper Progress */
    .stepper-progress {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .step-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 2rem;
      cursor: default;
      transition: all 0.2s ease;
    }

    .step-item.clickable {
      cursor: pointer;
    }

    .step-item.clickable:hover {
      background: #f3f4f6;
    }

    .step-item.active {
      background: #6366f1;
      color: #fff;
    }

    .step-item.completed .step-number {
      background: #10b981;
      color: #fff;
    }

    .step-number {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      background: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .step-item.active .step-number {
      background: rgba(255, 255, 255, 0.2);
    }

    .step-number svg {
      width: 1rem;
      height: 1rem;
    }

    .step-label {
      font-size: 0.875rem;
      font-weight: 500;
      display: none;
    }

    @media (min-width: 768px) {
      .step-label {
        display: block;
      }
    }

    .step-connector {
      width: 2rem;
      height: 2px;
      background: #e5e7eb;
    }

    .step-connector.completed {
      background: #10b981;
    }

    /* Save Status */
    .save-status {
      font-size: 0.875rem;
      color: #6b7280;
      min-width: 80px;
      text-align: right;
    }

    .save-status .saving {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .save-status .saved {
      color: #10b981;
    }

    .spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid #e5e7eb;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Main Content */
    .order-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 1024px) {
      .order-content {
        grid-template-columns: 1fr 320px;
      }
    }

    .content-container {
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }

    .step-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .step-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .step-header p {
      font-size: 1rem;
      color: #6b7280;
      margin: 0;
    }

    .step-content {
      position: relative;
      min-height: 300px;
    }

    /* Loading Overlay */
    .loading-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 0.5rem;
    }

    .loading-spinner {
      width: 3rem;
      height: 3rem;
      border: 3px solid #e5e7eb;
      border-top-color: #6366f1;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 1rem;
    }

    /* Price Sidebar */
    .price-sidebar {
      display: none;
    }

    @media (min-width: 1024px) {
      .price-sidebar {
        display: block;
      }
    }

    .price-card {
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      position: sticky;
      top: 5rem;
    }

    .price-card h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1rem 0;
    }

    .price-breakdown {
      margin-bottom: 1.5rem;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .price-row.subtotal {
      font-weight: 500;
    }

    .price-row.discount {
      color: #10b981;
    }

    .price-row.total {
      font-weight: 600;
      font-size: 1rem;
      color: #1f2937;
      padding-top: 1rem;
    }

    .total-price {
      font-size: 1.25rem;
      color: #6366f1;
    }

    .price-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 0.5rem 0;
    }

    /* Free Includes */
    .free-includes {
      padding: 1rem;
      background: #f0fdf4;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    .free-includes h4 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #166534;
      margin: 0 0 0.75rem 0;
    }

    .free-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: #166534;
      margin-bottom: 0.5rem;
    }

    .free-item:last-child {
      margin-bottom: 0;
    }

    .free-item svg {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
    }

    .crossed-price {
      margin-left: auto;
      text-decoration: line-through;
      color: #9ca3af;
      font-size: 0.75rem;
    }

    /* Guarantee Badge */
    .guarantee-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 0.8125rem;
      color: #475569;
    }

    .guarantee-badge svg {
      width: 1.25rem;
      height: 1.25rem;
      color: #6366f1;
      flex-shrink: 0;
    }

    /* Error Toast */
    .error-toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: #ef4444;
      color: #fff;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    }

    .error-toast button {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: #fff;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .error-toast button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Payment Processing State */
    .payment-processing {
      text-align: center;
      padding: 3rem 2rem;
    }

    .processing-animation {
      margin-bottom: 2rem;
    }

    .card-icon {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      animation: pulse 2s ease-in-out infinite;
    }

    .card-icon svg {
      width: 2.5rem;
      height: 2.5rem;
      color: #fff;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
    }

    .processing-dots {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    .processing-dots span {
      width: 0.75rem;
      height: 0.75rem;
      background: #6366f1;
      border-radius: 50%;
      animation: bounce 1.4s ease-in-out infinite;
    }

    .processing-dots span:nth-child(1) { animation-delay: 0s; }
    .processing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .processing-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
    }

    .payment-processing h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.75rem 0;
    }

    .payment-processing p {
      font-size: 1rem;
      color: #6b7280;
      margin: 0 0 0.5rem 0;
    }

    .processing-note {
      font-size: 0.875rem !important;
      color: #9ca3af !important;
      margin-top: 1rem !important;
    }

    .security-badges {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }

    .security-badges .badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 2rem;
      font-size: 0.8125rem;
      color: #166534;
    }

    .security-badges .badge svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    /* Order Complete State */
    .order-complete {
      text-align: center;
      padding: 3rem 2rem;
    }

    .complete-icon {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .complete-icon.success {
      animation: scaleIn 0.5s ease-out;
    }

    @keyframes scaleIn {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }

    .complete-icon svg {
      width: 2.5rem;
      height: 2.5rem;
      color: #fff;
    }

    .order-complete h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.75rem 0;
    }

    .order-complete p {
      font-size: 1rem;
      color: #6b7280;
      margin: 0 0 0.5rem 0;
    }

    .order-complete .success-message {
      color: #166534;
      font-weight: 500;
    }

    .order-complete .order-id {
      font-family: monospace;
      font-size: 0.9375rem;
      color: #4b5563;
      background: #f3f4f6;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      display: inline-block;
      margin: 1rem 0 1.5rem;
    }

    /* Confirmation Details */
    .confirmation-details {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      margin: 2rem 0;
      text-align: left;
    }

    .confirmation-details h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1rem 0;
    }

    .next-steps {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .step-num {
      width: 2rem;
      height: 2rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
      flex-shrink: 0;
    }

    .step-info strong {
      display: block;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }

    .step-info p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }

    .email-note {
      font-size: 0.875rem !important;
      color: #9ca3af !important;
      margin: 1.5rem 0 !important;
    }

    .complete-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .complete-actions .btn-primary {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .complete-actions .btn-primary:hover {
      background: linear-gradient(135deg, #4f46e5, #4338ca);
      transform: translateY(-1px);
    }

    .complete-actions .btn-secondary {
      display: inline-flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      background: #fff;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 0.9375rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .complete-actions .btn-secondary:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  `]
})
export class OrderComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly submissionService = inject(PaperSubmissionService);  // Public for template access
  private pricingService = inject(PricingService);
  private authService = inject(AuthService);

  private destroy$ = new Subject<void>();

  // Step configuration
  readonly stepLabels = STEP_LABELS;
  readonly stepDescriptions = STEP_DESCRIPTIONS;

  // Payment processing state
  isProcessingPayment = signal(false);
  paymentComplete = signal(false);

  // State from services
  readonly currentStep = computed(() => this.submissionService.stepperState().currentStep);
  readonly isLoading = computed(() => this.submissionService.stepperState().isLoading);
  readonly isSaving = computed(() => this.submissionService.stepperState().isSaving);
  readonly lastSavedAt = computed(() => this.submissionService.stepperState().lastSavedAt);
  readonly error = computed(() => this.submissionService.stepperState().error);
  readonly currentBreakdown = computed(() => this.pricingService.currentBreakdown());
  readonly freeIncludes = computed(() => this.pricingService.freeIncludes());
  readonly moneyBackDays = computed(() => this.pricingService.moneyBackDays());

  ngOnInit(): void {
    // Load pricing config on init
    this.pricingService.loadPricingConfig().pipe(
      takeUntil(this.destroy$)
    ).subscribe();

    // Subscribe to both params and queryParams for route changes
    this.route.queryParams.pipe(
      takeUntil(this.destroy$)
    ).subscribe(queryParams => {
      const startFresh = queryParams['new'] === 'true';

      if (startFresh) {
        console.log('[OrderComponent] Starting fresh order');
        this.submissionService.resetState();
        // Clear the query param from URL without navigation
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      }
    });

    // Check for submission ID in route params
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const startFresh = this.route.snapshot.queryParams['new'] === 'true';

      if (params['id']) {
        console.log('[OrderComponent] Loading submission:', params['id']);
        this.submissionService.resumeSubmission(params['id']).subscribe({
          next: (response) => {
            console.log('[OrderComponent] Submission loaded:', response);
            console.log('[OrderComponent] Current step:', this.currentStep(), 'Type:', typeof this.currentStep());
            console.log('[OrderComponent] Stepper state:', this.submissionService.stepperState());
          },
          error: (err) => {
            console.error('[OrderComponent] Error loading submission:', err);
          }
        });
      } else if (this.authService.isAuthenticated() && !startFresh) {
        // Only check for existing draft if NOT starting fresh
        const user = this.authService.currentUser();
        if (user?._id) {
          this.initializeSubmission(user._id);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeSubmission(userId: string): void {
    this.submissionService.hasActiveDraft(userId).pipe(
      takeUntil(this.destroy$)
    ).subscribe(hasDraft => {
      if (hasDraft) {
        // Get the latest draft
        const submissions = this.submissionService.userSubmissions();
        const latestDraft = submissions.find(s => s.isDraft);
        if (latestDraft?._id) {
          this.submissionService.resumeSubmission(latestDraft._id).subscribe();
        }
      }
      // Note: new submission will be created after user completes step 0 (welcome/auth)
    });
  }

  isStepCompleted(step: number): boolean {
    return this.submissionService.isStepCompleted(step);
  }

  canNavigateToStep(step: number): boolean {
    return this.submissionService.canNavigateToStep(step);
  }

  navigateToStep(step: number): void {
    if (this.canNavigateToStep(step)) {
      this.submissionService.goToStep(step);
    }
  }

  nextStep(): void {
    const currentStep = this.submissionService.stepperState().currentStep;

    // If moving from welcome (step 0) to key details (step 1), ensure submission exists
    if (currentStep === 0 && this.authService.isAuthenticated()) {
      const user = this.authService.currentUser();
      const submissionId = this.submissionService.stepperState().submissionId;

      if (user?._id && !submissionId) {
        // Create submission first, then proceed to next step
        console.log('[OrderComponent] Creating submission before proceeding to step 1...');
        this.submissionService.createSubmission(user._id).subscribe({
          next: (response) => {
            console.log('[OrderComponent] Submission created:', response.result?._id);
            this.submissionService.nextStep();
          },
          error: (err) => {
            console.error('[OrderComponent] Error creating submission:', err);
            // Still try to proceed even if creation fails (will error on save)
            this.submissionService.nextStep();
          }
        });
        return;
      }
    }

    this.submissionService.nextStep();
  }

  previousStep(): void {
    this.submissionService.previousStep();
  }

  onStepComplete(step: number): void {
    this.submissionService.completeStep(step);
  }

  onSubmit(): void {
    const submissionId = this.submissionService.stepperState().submissionId;
    if (submissionId) {
      // Show payment processing screen
      this.isProcessingPayment.set(true);

      this.submissionService.submitPaper(submissionId, true).subscribe({
        next: () => {
          // Simulate payment processing delay (3-5 seconds)
          setTimeout(() => {
            this.isProcessingPayment.set(false);
            this.paymentComplete.set(true);
          }, 3500);
        },
        error: (err) => {
          console.error('Submit error:', err);
          this.isProcessingPayment.set(false);
        }
      });
    }
  }

  formatPrice(price: number): string {
    return this.pricingService.formatPrice(price);
  }

  clearError(): void {
    // Reset error state by triggering a state update
    // This would require adding a clearError method to the service
  }

  startNewOrder(): void {
    // Reset the submission service state for a new order
    this.submissionService.resetState();
  }
}
