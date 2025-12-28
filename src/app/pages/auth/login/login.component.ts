import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <span class="auth-icon material-icons">login</span>
            <h1>Welcome Back</h1>
            <p>Sign in to access your account</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <!-- Error Message -->
            <div class="error-message" *ngIf="errorMessage">
              <span class="material-icons">error_outline</span>
              {{ errorMessage }}
            </div>

            <!-- Email Field -->
            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                type="email"
                id="email"
                formControlName="email"
                placeholder="Enter your email"
                [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              />
              <span class="field-error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
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
                placeholder="Enter your password"
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              />
              <span class="field-error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password is required
              </span>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="form-row">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="rememberMe" />
                <span>Remember me</span>
              </label>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn btn-primary btn-block" [disabled]="isLoading">
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading" class="loading-spinner"></span>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span>or continue with</span>
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
              Sign in with Google
            </button>
          </div>

          <!-- Register Link -->
          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/auth/register">Create one</a></p>
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
      max-width: 440px;
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

    .form-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: #666;
    }

    .checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: #D04A02;
    }

    .forgot-link {
      color: #D04A02;
      text-decoration: none;
    }

    .forgot-link:hover {
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

    .error-message .material-icons {
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if already authenticated
    if (this.isBrowser && this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Check for redirect URL
        const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
        sessionStorage.removeItem('redirectUrl');
        this.router.navigate([redirectUrl]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid email or password. Please try again.';
      }
    });
  }

  loginWithGoogle(): void {
    this.authService.loginWithGoogle();
  }
}
