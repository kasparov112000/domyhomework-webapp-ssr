import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    main {
      flex: 1;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'DoMyHomework';
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Initialize authentication on app startup (browser only)
    if (this.isBrowser) {
      this.authService.initAuth().subscribe({
        next: (isAuthenticated) => {
          console.log('[App] Auth initialized, authenticated:', isAuthenticated);
        },
        error: (error) => {
          console.error('[App] Auth initialization error:', error);
        }
      });
    }
  }
}