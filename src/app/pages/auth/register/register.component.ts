import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <span class="auth-icon material-icons">person_add</span>
            <h1>Create Account</h1>
            <p>Start your learning journey today</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <!-- Error Message -->
            <div class="error-message" *ngIf="errorMessage">
              <span class="material-icons">error_outline</span>
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div class="success-message" *ngIf="successMessage">
              <span class="material-icons">check_circle</span>
              {{ successMessage }}
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                placeholder="john@example.com"
                [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              />
              <span class="field-error" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                Please enter a valid email address
              </span>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                formControlName="password"
                placeholder="Create a strong password"
                [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              />
              <span class="field-error" *ngIf="registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched">
                Password is required
              </span>
              <span class="field-error" *ngIf="registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched">
                Password must be at least 8 characters
              </span>
            </div>

            <!-- Confirm Password Field -->
            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                formControlName="confirmPassword"
                placeholder="Confirm your password"
                [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
              />
              <span class="field-error" *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
                Passwords do not match
              </span>
            </div>

            <!-- Terms Checkbox -->
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="acceptTerms" />
                <span>I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a></span>
              </label>
              <span class="field-error" *ngIf="registerForm.get('acceptTerms')?.invalid && registerForm.get('acceptTerms')?.touched">
                You must accept the terms to continue
              </span>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary btn-block" [disabled]="isLoading">
              <span *ngIf="!isLoading">Create Account</span>
              <span *ngIf="isLoading" class="loading-spinner"></span>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span>or sign up with</span>
          </div>

          <!-- Social Login -->
          <div class="social-login">
            <button class="btn btn-google" (click)="loginWithGoogle()">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          <!-- Login Link -->
          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/auth/login">Sign in</a></p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 140px);
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .auth-container {
      width: 100%;
      max-width: 480px;
    }

    .auth-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 2.5rem;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-icon {
      font-size: 48px;
      color: #D04A02;
      display: inline-block;
      margin-bottom: 1rem;
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      line-height: 1;
    }

    .auth-header h1 {
      font-size: 1.75rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .auth-header p {
      color: #666;
      margin: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
    }

    .form-group input[type="email"],
    .form-group input[type="password"],
    .form-group input[type="text"] {
      padding: 0.875rem 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #D04A02;
      box-shadow: 0 0 0 3px rgba(208, 74, 2, 0.1);
    }

    .form-group input.error {
      border-color: #dc3545;
    }

    .field-error {
      font-size: 0.75rem;
      color: #dc3545;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      cursor: pointer;
      color: #666;
      font-size: 0.875rem;
      line-height: 1.4;
    }

    .checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      margin-top: 2px;
      accent-color: #D04A02;
    }

    .checkbox-label a {
      color: #D04A02;
      text-decoration: none;
    }

    .checkbox-label a:hover {
      text-decoration: underline;
    }

    .btn-block {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
    }

    .btn-primary {
      background: #D04A02;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      background: #b03902;
      box-shadow: 0 4px 12px rgba(208, 74, 2, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid white;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 1.5rem 0;
      color: #999;
      font-size: 0.875rem;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #ddd;
    }

    .divider span {
      padding: 0 1rem;
    }

    .social-login {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .btn-google {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.875rem;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 500;
      color: #333;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
    }

    .btn-google:hover {
      background: #f8f9fa;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #eee;
    }

    .auth-footer p {
      color: #666;
      margin: 0;
    }

    .auth-footer a {
      color: #D04A02;
      font-weight: 500;
      text-decoration: none;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #dc2626;
      font-size: 0.875rem;
    }

    .success-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      color: #16a34a;
      font-size: 0.875rem;
    }

    .error-message .material-icons,
    .success-message .material-icons {
      font-size: 20px;
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 1.5rem;
      }

      .auth-header h1 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Check if already authenticated
    if (this.isBrowser && this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  /**
   * Custom validator to check password match
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { email, password } = this.registerForm.value;

    this.authService.register({ email, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Redirecting...';

        setTimeout(() => {
          const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
          sessionStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
