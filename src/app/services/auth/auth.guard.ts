import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { TokenStorageService } from './token-storage.service';

/**
 * List of paths that don't require authentication
 */
const PUBLIC_PATHS = [
  '/',
  '/about',
  '/features',
  '/pricing',
  '/contact',
  '/auth/login',
  '/auth/register',
  '/auth/callback'
];

/**
 * Check if a path is public (doesn't require auth)
 */
function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some(publicPath => {
    if (publicPath === '/') {
      return path === '/' || path === '';
    }
    return path.startsWith(publicPath);
  });
}

/**
 * Functional route guard for protected routes
 * Angular 17+ style using CanActivateFn
 */
export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  const url = state.url;

  // Allow public paths without authentication
  if (isPublicPath(url)) {
    return true;
  }

  // During SSR, allow access (auth will be checked client-side)
  if (!isBrowser) {
    return true;
  }

  // Check if user is authenticated
  if (tokenStorage.isLoggedIn()) {
    return true;
  }

  // Not authenticated - redirect to login
  console.log('[AuthGuard] Access denied, redirecting to login');

  // Store the attempted URL for redirecting after login
  sessionStorage.setItem('redirectUrl', url);

  return router.createUrlTree(['/auth/login']);
};

/**
 * Admin-only route guard
 * Requires both authentication and admin role
 */
export const adminGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  // During SSR, allow access (auth will be checked client-side)
  if (!isBrowser) {
    return true;
  }

  // First check if authenticated
  if (!tokenStorage.isLoggedIn()) {
    sessionStorage.setItem('redirectUrl', state.url);
    return router.createUrlTree(['/auth/login']);
  }

  // Check if user is admin
  if (tokenStorage.isAdmin()) {
    return true;
  }

  // Not admin - redirect to home
  console.log('[AdminGuard] Access denied, user is not admin');
  return router.createUrlTree(['/']);
};
