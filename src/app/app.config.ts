import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './services/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Provide HttpClient with fetch API and auth interceptor
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    // Only provide hydration in production (SSR mode)
    // In dev mode with ng serve, hydration causes blank screen issues
    ...(isDevMode() ? [] : [provideClientHydration()])
  ]
};