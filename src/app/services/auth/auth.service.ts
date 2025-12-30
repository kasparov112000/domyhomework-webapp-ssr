import { Injectable, PLATFORM_ID, Inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  msg?: string;
  result?: any;
  responseCookie?: string;
  // Also support standard format
  token?: string;
  user?: any;
  message?: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: any[];
  linesOfService?: any[];
  mainCategory?: any;
  category?: any;
}

/**
 * AuthService - Handles authentication operations
 * Uses the same endpoints and flow as the main webapp
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;
  private baseUrl: string;

  // Reactive state using signals (Angular 17+)
  private _isAuthenticated = signal<boolean>(false);
  private _currentUser = signal<UserProfile | null>(null);
  private _isLoading = signal<boolean>(false);

  // Public computed signals
  readonly isAuthenticated = computed(() => this._isAuthenticated());
  readonly currentUser = computed(() => this._currentUser());
  readonly isLoading = computed(() => this._isLoading());
  readonly isAdmin = computed(() => this.tokenStorage.isAdmin());

  // For components that need Observable pattern
  private authState$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenStorage: TokenStorageService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.baseUrl = this.getApiBaseUrl();

    // Initialize auth state from stored token
    if (this.isBrowser) {
      const hasToken = this.tokenStorage.hasToken();
      this._isAuthenticated.set(hasToken);
      this.authState$.next(hasToken);

      if (hasToken) {
        const user = this.tokenStorage.getUser();
        if (user) {
          this._currentUser.set(user);
        }
      }
    }
  }

  /**
   * Determine the API base URL based on environment
   */
  private getApiBaseUrl(): string {
    if (!this.isBrowser) {
      // Server-side rendering - return empty, auth only works client-side
      return '';
    }

    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Local development - use proxy or direct orchestrator
      return '/apg/orchnest/user';
    } else if (hostname.includes('domyhomework')) {
      return 'https://domyhomework.com/apg/orchnest/user';
    } else {
      return 'https://app.learnbytesting.ai/apg/orchnest/user';
    }
  }

  /**
   * Get the orchestrator API URL for general API calls
   */
  private getOrchestratorUrl(): string {
    if (!this.isBrowser) {
      // Server-side rendering - return empty, auth only works client-side
      return '';
    }

    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '/api';
    } else if (hostname.includes('domyhomework')) {
      return 'https://domyhomework.com/api';
    } else {
      return 'https://app.learnbytesting.ai/api';
    }
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this._isLoading.set(true);

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    }).pipe(
      tap(response => {
        // Handle orchnest response format (responseCookie/result) or standard (token/user)
        const token = response.responseCookie || response.token;
        const user = response.result || response.user;

        if (token) {
          this.tokenStorage.saveToken(token);
          if (user) {
            this.tokenStorage.saveUser(user);
            this._currentUser.set(user);
          }
          this._isAuthenticated.set(true);
          this.authState$.next(true);
          console.log('[AuthService] Login successful, user authenticated');
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        console.error('[AuthService] Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register a new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    this._isLoading.set(true);

    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    }).pipe(
      tap(response => {
        // Handle orchnest response format (responseCookie/result) or standard (token/user)
        const token = response.responseCookie || response.token;
        const user = response.result || response.user;

        if (token) {
          this.tokenStorage.saveToken(token);
          if (user) {
            this.tokenStorage.saveUser(user);
            this._currentUser.set(user);
          }
          this._isAuthenticated.set(true);
          this.authState$.next(true);
          console.log('[AuthService] Registration successful, user authenticated');
        }
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        console.error('[AuthService] Register error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout the current user
   */
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => this.clearAuthState()),
      catchError(error => {
        // Clear state even if API call fails
        this.clearAuthState();
        return of(null);
      })
    );
  }

  /**
   * Clear all authentication state
   */
  clearAuthState(): void {
    this.tokenStorage.signOut();
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
    this.authState$.next(false);
  }

  /**
   * Load the current user's profile from the API
   */
  loadProfile(): Observable<UserProfile | null> {
    if (!this.tokenStorage.hasToken()) {
      return of(null);
    }

    const apiUrl = this.getOrchestratorUrl();

    return this.http.get<any>(`${apiUrl}/users/session/current`, {
      withCredentials: true
    }).pipe(
      map(response => {
        const profile = response?.result || response;
        if (profile) {
          this.tokenStorage.saveUser(profile);
          this._currentUser.set(profile);
          this._isAuthenticated.set(true);
          this.authState$.next(true);
        }
        return profile;
      }),
      catchError(error => {
        console.error('[AuthService] Error loading profile:', error);
        if (error.status === 401) {
          this.clearAuthState();
        }
        return of(null);
      })
    );
  }

  /**
   * Handle OAuth callback (Google, etc.)
   * Extracts token from URL and saves it
   */
  handleOAuthCallback(token: string): Observable<UserProfile | null> {
    if (!token) {
      return of(null);
    }

    this.tokenStorage.saveToken(token);
    this._isAuthenticated.set(true);
    this.authState$.next(true);

    // Load full profile after saving token
    return this.loadProfile();
  }

  /**
   * Initiate Google OAuth login
   */
  loginWithGoogle(): void {
    if (!this.isBrowser) return;

    const apiUrl = this.getOrchestratorUrl();
    window.location.href = `${apiUrl}/auth/google`;
  }

  /**
   * Check if user is authenticated (Observable version)
   */
  isAuthenticated$(): Observable<boolean> {
    return this.authState$.asObservable();
  }

  /**
   * Initialize authentication state on app startup
   */
  initAuth(): Observable<boolean> {
    if (!this.isBrowser) {
      return of(false);
    }

    if (this.tokenStorage.hasToken()) {
      return this.loadProfile().pipe(
        map(profile => !!profile),
        catchError(() => of(false))
      );
    }

    return of(false);
  }

  /**
   * Get the current auth token
   */
  getToken(): string | null {
    return this.tokenStorage.getToken();
  }
}
