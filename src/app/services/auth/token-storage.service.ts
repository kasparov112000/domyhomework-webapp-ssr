import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'lbt-auth-token';
const USER_KEY = 'lbt-auth-user';

/**
 * TokenStorageService - Manages JWT token and user data in localStorage
 * Uses the same storage keys as the main webapp for shared authentication
 */
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Clear all auth data from storage
   */
  signOut(): void {
    if (!this.isBrowser) return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.clear();
  }

  /**
   * Save JWT token to localStorage
   */
  saveToken(token: string): void {
    if (!this.isBrowser) return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Get JWT token from localStorage
   */
  getToken(): string | null {
    if (!this.isBrowser) return null;

    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Check if a valid token exists
   */
  hasToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = this.decodeToken(token);
      if (payload && payload.exp) {
        const expirationDate = new Date(payload.exp * 1000);
        return expirationDate > new Date();
      }
      return true; // If no expiration, assume valid
    } catch {
      return false;
    }
  }

  /**
   * Decode JWT token payload
   */
  decodeToken(token: string): any {
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  /**
   * Save user data to localStorage
   */
  saveUser(user: any): void {
    if (!this.isBrowser) return;

    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Get user data from localStorage
   */
  getUser(): any {
    if (!this.isBrowser) return null;

    const user = localStorage.getItem(USER_KEY);
    if (user) {
      try {
        return JSON.parse(user);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.hasToken();
  }

  /**
   * Get user roles from stored user data
   */
  getUserRoles(): string[] {
    const user = this.getUser();
    if (!user || !user.roles) return [];

    return user.roles.map((r: any) => typeof r === 'string' ? r : r.name);
  }

  /**
   * Check if user has admin role
   */
  isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.some(role =>
      role.toLowerCase().includes('admin') ||
      role.toLowerCase().includes('system')
    );
  }
}
