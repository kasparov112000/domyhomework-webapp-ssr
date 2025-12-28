import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenStorageService } from './token-storage.service';

/**
 * List of URL patterns that should not have auth headers added
 */
const PUBLIC_URLS = [
  '/assets/',
  '/healthcheck',
  '/public/',
  '.json',
  '.js',
  '.css',
  '.ico',
  '.png',
  '.jpg',
  '.svg',
  '/auth/login',
  '/auth/register',
  '/auth/callback',
  '/user/login',
  '/user/register',
  '/orchnest/user/login',
  '/orchnest/user/register'
];

/**
 * Check if URL should be excluded from auth header injection
 */
function isPublicUrl(url: string): boolean {
  return PUBLIC_URLS.some(pattern => url.includes(pattern));
}

/**
 * Functional HTTP interceptor for adding auth headers
 * Angular 17+ style using HttpInterceptorFn
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  // Skip token injection for public URLs or if not in browser
  if (!isBrowser || isPublicUrl(req.url)) {
    return next(req);
  }

  // Get token from storage
  const token = tokenStorage.getToken();

  // Clone request with auth header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - redirect to login
      if (error.status === 401) {
        console.warn('[AuthInterceptor] 401 Unauthorized - clearing auth state');
        tokenStorage.signOut();
        router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    })
  );
};
