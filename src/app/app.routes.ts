import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'features',
    loadComponent: () => import('./pages/features/features.component').then(m => m.FeaturesComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },

  // Auth routes
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./pages/auth/callback/callback.component').then(m => m.AuthCallbackComponent)
  },

  // Protected admin routes
  {
    path: 'admin/visitor-stats',
    loadComponent: () => import('./pages/admin/visitor-stats.component').then(m => m.VisitorStatsComponent),
    canActivate: [adminGuard]
  },

  // Catch-all redirect
  {
    path: '**',
    redirectTo: ''
  }
];