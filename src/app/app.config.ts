import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Only provide hydration in production (SSR mode)
    // In dev mode with ng serve, hydration causes blank screen issues
    ...(isDevMode() ? [] : [provideClientHydration()])
  ]
};