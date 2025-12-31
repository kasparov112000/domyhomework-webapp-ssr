import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-welcome-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="welcome-step">
      @if (isAuthenticated()) {
        <!-- Authenticated User View -->
        <div class="authenticated-view">
          <div class="welcome-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2>Welcome back, {{ currentUser()?.firstName || 'there' }}!</h2>
          <p>You're logged in as <strong>{{ currentUser()?.email }}</strong></p>
          <p class="subtitle">Ready to submit your paper? Let's get started!</p>

          <button class="btn-primary" (click)="continueToOrder()">
            Continue to Order
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      } @else {
        <!-- Guest View - Login/Register Options -->
        <div class="guest-view">
          <div class="auth-tabs">
            <button
              class="tab"
              [class.active]="activeTab() === 'login'"
              (click)="setActiveTab('login')"
            >
              Sign In
            </button>
            <button
              class="tab"
              [class.active]="activeTab() === 'register'"
              (click)="setActiveTab('register')"
            >
              Create Account
            </button>
          </div>

          @if (activeTab() === 'login') {
            <!-- Login Form -->
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="auth-form">
              <div class="form-group">
                <label for="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  formControlName="email"
                  placeholder="Enter your email"
                  [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                >
                @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                  <span class="error-text">Please enter a valid email</span>
                }
              </div>

              <div class="form-group">
                <label for="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  formControlName="password"
                  placeholder="Enter your password"
                  [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                >
                @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                  <span class="error-text">Password is required</span>
                }
              </div>

              @if (errorMessage()) {
                <div class="error-banner">{{ errorMessage() }}</div>
              }

              <button
                type="submit"
                class="btn-primary"
                [disabled]="loginForm.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <span class="spinner"></span> Signing In...
                } @else {
                  Sign In
                }
              </button>
            </form>
          } @else {
            <!-- Register Form -->
            <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="auth-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    formControlName="firstName"
                    placeholder="First name"
                  >
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    formControlName="lastName"
                    placeholder="Last name"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="register-email">Email</label>
                <input
                  id="register-email"
                  type="email"
                  formControlName="email"
                  placeholder="Enter your email"
                  [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                >
                @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                  <span class="error-text">Please enter a valid email</span>
                }
              </div>

              <div class="form-group">
                <label for="register-password">Password</label>
                <input
                  id="register-password"
                  type="password"
                  formControlName="password"
                  placeholder="Create a password (min. 8 characters)"
                  [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                >
                @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                  <span class="error-text">Password must be at least 8 characters</span>
                }
              </div>

              @if (errorMessage()) {
                <div class="error-banner">{{ errorMessage() }}</div>
              }

              <button
                type="submit"
                class="btn-primary"
                [disabled]="registerForm.invalid || isLoading()"
              >
                @if (isLoading()) {
                  <span class="spinner"></span> Creating Account...
                } @else {
                  Create Account
                }
              </button>
            </form>
          }

          <!-- Divider -->
          <div class="divider">
            <span>or continue with</span>
          </div>

          <!-- Social Login -->
          <button class="btn-google" (click)="loginWithGoogle()">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .welcome-step {
      max-width: 480px;
      margin: 0 auto;
    }

    /* Authenticated View */
    .authenticated-view {
      text-align: center;
      padding: 2rem;
    }

    .welcome-icon {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .welcome-icon svg {
      width: 2.5rem;
      height: 2.5rem;
      color: #fff;
    }

    .authenticated-view h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .authenticated-view p {
      color: #6b7280;
      margin: 0 0 0.5rem 0;
    }

    .authenticated-view .subtitle {
      font-size: 1.125rem;
      color: #4b5563;
      margin-bottom: 2rem;
    }

    .authenticated-view strong {
      color: #1f2937;
    }

    /* Guest View */
    .guest-view {
      padding: 1rem;
    }

    /* Auth Tabs */
    .auth-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      padding: 0.25rem;
      background: #f3f4f6;
      border-radius: 0.5rem;
    }

    .auth-tabs .tab {
      flex: 1;
      padding: 0.75rem 1rem;
      border: none;
      background: transparent;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #6b7280;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .auth-tabs .tab:hover {
      color: #4b5563;
    }

    .auth-tabs .tab.active {
      background: #fff;
      color: #1f2937;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* Auth Form */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .form-group input {
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #D04A02;
      box-shadow: 0 0 0 3px rgba(208, 74, 2, 0.1);
    }

    .form-group input.error {
      border-color: #ef4444;
    }

    .error-text {
      font-size: 0.75rem;
      color: #ef4444;
    }

    .error-banner {
      padding: 0.75rem 1rem;
      background: #fef2f2;
      border: 1px solid #fee2e2;
      border-radius: 0.5rem;
      color: #dc2626;
      font-size: 0.875rem;
    }

    /* Buttons */
    .btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.875rem 1.5rem;
      background: linear-gradient(135deg, #D04A02, #B03902);
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
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

    /* Divider */
    .divider {
      display: flex;
      align-items: center;
      margin: 1.5rem 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }

    .divider span {
      padding: 0 1rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    /* Google Button */
    .btn-google {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.875rem 1.5rem;
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-google:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }

    .btn-google svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  `]
})
export class WelcomeStepComponent {
  @Output() stepComplete = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // State
  activeTab = signal<'login' | 'register'>('register');
  errorMessage = signal<string | null>(null);

  // Auth state from service
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly currentUser = this.authService.currentUser;
  readonly isLoading = this.authService.isLoading;

  // Forms
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registerForm: FormGroup = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  setActiveTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.errorMessage.set(null);
  }

  onLogin(): void {
    if (this.loginForm.invalid) return;

    this.errorMessage.set(null);
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.stepComplete.emit();
        this.next.emit();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Invalid email or password');
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    this.errorMessage.set(null);
    const { email, password, firstName, lastName } = this.registerForm.value;

    this.authService.register({ email, password, firstName, lastName }).subscribe({
      next: () => {
        this.stepComplete.emit();
        this.next.emit();
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Registration failed. Please try again.');
      }
    });
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  continueToOrder(): void {
    this.stepComplete.emit();
    this.next.emit();
  }
}
