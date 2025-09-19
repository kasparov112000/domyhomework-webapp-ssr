import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header>
      <div class="container">
        <nav>
          <a class="logo" routerLink="/">
            <span class="logo-icon material-icons">psychology</span>
            <span class="logo-text">LearnByTesting.ai</span>
          </a>
          <ul class="nav-links">
            <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
            <li><a routerLink="/features" routerLinkActive="active">Features</a></li>
            <li><a routerLink="/about" routerLinkActive="active">About</a></li>
            <li><a routerLink="/pricing" routerLinkActive="active">Pricing</a></li>
            <li><a routerLink="/contact" routerLinkActive="active">Contact</a></li>
            <li><a href="https://app.learnbytesting.ai" class="btn btn-primary">Launch App</a></li>
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
      gap: 0.5rem;
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
    }
    
    .logo-text {
      font-size: 1.75rem;
      font-weight: bold;
      color: #D04A02;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .logo:hover .logo-icon,
    .logo:hover .logo-text {
      color: #B03902;
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
    
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {}