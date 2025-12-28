import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="callback-page">
      <div class="callback-container">
        <div class="callback-card">
          <!-- Loading State -->
          <div class="loading-state" *ngIf="isLoading">
            <div class="spinner"></div>
            <h2>Signing you in...</h2>
            <p>Please wait while we complete authentication</p>
          </div>

          <!-- Error State -->
          <div class="error-state" *ngIf="errorMessage">
            <span class="error-icon material-icons">error_outline</span>
            <h2>Authentication Failed</h2>
            <p>{{ errorMessage }}</p>
            <button class="btn btn-primary" (click)="goToLogin()">
              Try Again
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .callback-page {
      min-height: calc(100vh - 140px);
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .callback-container {
      width: 100%;
      max-width: 400px;
    }

    .callback-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 3rem 2.5rem;
      text-align: center;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #D04A02;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-state h2 {
      font-size: 1.5rem;
      color: #333;
      margin: 0;
    }

    .loading-state p {
      color: #666;
      margin: 0;
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .error-icon {
      font-size: 64px;
      color: #dc3545;
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      line-height: 1;
    }

    .error-state h2 {
      font-size: 1.5rem;
      color: #333;
      margin: 0;
    }

    .error-state p {
      color: #666;
      margin: 0 0 1rem;
    }

    .btn-primary {
      background: #D04A02;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.875rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, box-shadow 0.2s;
    }

    .btn-primary:hover {
      background: #b03902;
      box-shadow: 0 4px 12px rgba(208, 74, 2, 0.3);
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  private isBrowser: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    // Get token from query params
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const error = params['error'];

      if (error) {
        this.isLoading = false;
        this.errorMessage = this.getErrorMessage(error);
        return;
      }

      if (token) {
        this.handleToken(token);
      } else {
        // Check if token is in hash fragment (some OAuth flows)
        const hash = window.location.hash;
        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1));
          const hashToken = hashParams.get('token') || hashParams.get('access_token');
          if (hashToken) {
            this.handleToken(hashToken);
            return;
          }
        }

        this.isLoading = false;
        this.errorMessage = 'No authentication token received. Please try again.';
      }
    });
  }

  private handleToken(token: string): void {
    this.authService.handleOAuthCallback(token).subscribe({
      next: (profile) => {
        this.isLoading = false;
        if (profile) {
          // Check for redirect URL
          const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
          sessionStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        } else {
          this.errorMessage = 'Failed to load user profile. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('[AuthCallback] Error:', error);
        this.errorMessage = 'Authentication failed. Please try again.';
      }
    });
  }

  private getErrorMessage(error: string): string {
    switch (error) {
      case 'access_denied':
        return 'Access was denied. Please try again or use a different sign-in method.';
      case 'invalid_request':
        return 'Invalid authentication request. Please try again.';
      case 'unauthorized_client':
        return 'This application is not authorized. Please contact support.';
      case 'server_error':
        return 'Server error occurred. Please try again later.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
