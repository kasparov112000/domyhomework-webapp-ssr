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
            <span class="logo-text">LearnByTesting</span>
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
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(135deg, #D04A02 0%, #E85A12 50%, #D04A02 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-family: 'Roboto', sans-serif;
      position: relative;
      animation: shimmer 3s ease-in-out infinite;
    }
    
    @keyframes shimmer {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .logo-text::after {
      content: '.ai';
      position: absolute;
      right: -2px;
      top: -8px;
      font-size: 0.6em;
      font-weight: 600;
      background: linear-gradient(135deg, #E85A12, #FF6B22);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.5px;
      text-transform: lowercase;
      animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.8; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.05); }
    }
    
    .logo:hover .logo-icon {
      color: #B03902;
      transform: rotate(15deg);
      transition: transform 0.3s ease;
    }
    
    .logo:hover .logo-text {
      animation-duration: 1s;
    }
    
    .logo:hover .logo-text::after {
      animation-duration: 1s;
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