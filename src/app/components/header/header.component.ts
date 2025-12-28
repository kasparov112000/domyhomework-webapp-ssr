import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header>
      <div class="container">
        <nav>
          <a class="logo" routerLink="/">
            <span class="logo-icon material-icons">smart_toy</span>
            <span class="logo-text">
              <span class="do">Do</span>
              <span class="my">My</span>
              <span class="homework">Homework</span>
              <span class="dot">.</span>
              <span class="ai">ai</span>
            </span>
          </a>

          <!-- Mobile menu button -->
          <button class="mobile-menu-btn" (click)="toggleMobileMenu()" [class.active]="showMobileMenu">
            <span class="material-icons">{{ showMobileMenu ? 'close' : 'menu' }}</span>
          </button>

          <ul class="nav-links" [class.mobile-open]="showMobileMenu">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMobileMenu()">Home</a></li>
            <li><a routerLink="/features" routerLinkActive="active" (click)="closeMobileMenu()">Features</a></li>
            <li><a routerLink="/about" routerLinkActive="active" (click)="closeMobileMenu()">About</a></li>
            <li><a routerLink="/pricing" routerLinkActive="active" (click)="closeMobileMenu()">Pricing</a></li>
            <li><a routerLink="/contact" routerLinkActive="active" (click)="closeMobileMenu()">Contact</a></li>

            <!-- Auth buttons -->
            <ng-container *ngIf="!authService.isAuthenticated(); else loggedInTemplate">
              <li><a routerLink="/auth/login" class="nav-link-auth" (click)="closeMobileMenu()">Sign In</a></li>
              <li><a routerLink="/auth/register" class="btn btn-primary" (click)="closeMobileMenu()">Get Started</a></li>
            </ng-container>

            <ng-template #loggedInTemplate>
              <li *ngIf="authService.isAdmin()">
                <a routerLink="/admin/visitor-stats" routerLinkActive="active" (click)="closeMobileMenu()">
                  <span class="material-icons nav-icon">analytics</span>
                  Admin
                </a>
              </li>
              <li class="user-menu">
                <button class="user-btn" (click)="toggleUserMenu()">
                  <span class="material-icons">account_circle</span>
                  <span class="user-name">{{ getUserName() }}</span>
                  <span class="material-icons arrow">expand_more</span>
                </button>
                <div class="dropdown-menu" *ngIf="showUserMenu">
                  <a href="https://app.domyhomework.ai" class="dropdown-item" (click)="closeMobileMenu()">
                    <span class="material-icons">launch</span>
                    Launch App
                  </a>
                  <button class="dropdown-item" (click)="logout()">
                    <span class="material-icons">logout</span>
                    Sign Out
                  </button>
                </div>
              </li>
            </ng-template>
          </ul>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    header {
      background-color: #fff;
      background-image: linear-gradient(to right, #fff 0%, #fff 100%);
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.26);
      padding: 1rem 0;
      position: relative;
      z-index: 1030;
    }
    
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 0;
      text-decoration: none;
    }
    
    .logo-icon {
      font-size: 32px;
      color: #D04A02;
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
      margin-right: -2px;
      transition: all 0.3s ease;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-family: 'Roboto', sans-serif;
      display: flex;
      align-items: baseline;
      position: relative;
    }
    
    .do {
      font-weight: 700;
      color: #D04A02;
      letter-spacing: -0.5px;
    }

    .my {
      font-weight: 300;
      color: #666;
      font-size: 0.85em;
      margin: 0 2px;
      position: relative;
      top: -2px;
    }

    .homework {
      font-weight: 700;
      color: #333;
      letter-spacing: -0.5px;
    }

    .dot {
      color: #D04A02;
      font-weight: 700;
      margin: 0 1px;
    }

    .ai {
      font-weight: 900;
      background: #D04A02;
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75em;
      position: relative;
      top: -2px;
      margin-left: 2px;
    }

    .logo:hover .logo-icon {
      transform: scale(1.1) rotate(10deg);
    }

    .logo:hover .do {
      color: #333;
    }

    .logo:hover .homework {
      color: #D04A02;
    }
    
    .logo:hover .ai {
      background: #333;
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    
    .logo-text span {
      transition: all 0.3s ease;
    }
    
    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
      align-items: center;
    }
    
    .nav-links a {
      color: #333;
      font-weight: 500;
      transition: color 0.2s ease-in-out;
      position: relative;
      padding: 0.5rem 0;
    }
    
    .nav-links a:hover {
      color: #D04A02;
    }
    
    .nav-links a.active {
      color: #D04A02;
    }
    
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #D04A02;
    }
    
    .btn {
      margin-left: 1rem;
    }

    .nav-link-auth {
      color: #D04A02 !important;
      font-weight: 600 !important;
    }

    .nav-icon {
      font-size: 18px;
      vertical-align: middle;
      margin-right: 4px;
    }

    .user-menu {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #333;
      transition: all 0.2s;
    }

    .user-btn:hover {
      border-color: #D04A02;
      background: rgba(208, 74, 2, 0.05);
    }

    .user-btn .material-icons {
      font-size: 20px;
      color: #D04A02;
    }

    .user-btn .arrow {
      font-size: 18px;
      color: #666;
      transition: transform 0.2s;
    }

    .user-name {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      min-width: 180px;
      overflow: hidden;
      z-index: 1000;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      color: #333;
      font-size: 0.875rem;
      text-align: left;
      cursor: pointer;
      transition: background 0.2s;
      text-decoration: none;
    }

    .dropdown-item:hover {
      background: #f5f5f5;
    }

    .dropdown-item .material-icons {
      font-size: 18px;
      color: #666;
    }

    /* Mobile menu button */
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      color: #333;
      border-radius: 8px;
      transition: all 0.2s;
    }

    .mobile-menu-btn:hover {
      background: rgba(208, 74, 2, 0.1);
      color: #D04A02;
    }

    .mobile-menu-btn.active {
      color: #D04A02;
    }

    .mobile-menu-btn .material-icons {
      font-size: 28px;
    }

    @media (max-width: 768px) {
      .mobile-menu-btn {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 1rem;
        gap: 0;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border-top: 1px solid #eee;
      }

      .nav-links.mobile-open {
        display: flex;
      }

      .nav-links li {
        width: 100%;
      }

      .nav-links a {
        display: block;
        padding: 1rem;
        border-radius: 8px;
      }

      .nav-links a:hover {
        background: rgba(208, 74, 2, 0.05);
      }

      .nav-links .btn {
        margin: 0.5rem 0 0 0;
        text-align: center;
        display: block;
      }

      .nav-links .nav-link-auth {
        text-align: center;
        background: rgba(208, 74, 2, 0.1);
        margin-top: 0.5rem;
      }

      .user-menu {
        width: 100%;
      }

      .user-btn {
        width: 100%;
        justify-content: center;
      }

      .dropdown-menu {
        position: static;
        box-shadow: none;
        border: 1px solid #eee;
        margin-top: 0.5rem;
      }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  showUserMenu = false;
  showMobileMenu = false;

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    // Close user menu when toggling mobile menu
    if (!this.showMobileMenu) {
      this.showUserMenu = false;
    }
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
    this.showUserMenu = false;
  }

  getUserName(): string {
    const user = this.authService.currentUser();
    if (user) {
      if (user.firstName) {
        return user.firstName;
      }
      if (user.email) {
        return user.email.split('@')[0];
      }
    }
    return 'User';
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }
}