import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>LearnByTesting</h3>
            <p>Transform your learning through interactive testing and personalized education.</p>
          </div>
          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/features">Features</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Connect</h4>
            <p>Email: info&#64;learnbytesting.ai</p>
            <p>Follow us on social media</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} LearnByTesting. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      background: #2c3e50;
      color: white;
      padding: 3rem 0 1rem;
      margin-top: 4rem;
    }
    
    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    h3, h4 {
      color: white;
      margin-bottom: 1rem;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    li {
      margin-bottom: 0.5rem;
    }
    
    a {
      color: #ecf0f1;
      transition: color 0.3s;
    }
    
    a:hover {
      color: #007bff;
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 2rem;
      border-top: 1px solid #34495e;
      color: #bdc3c7;
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}