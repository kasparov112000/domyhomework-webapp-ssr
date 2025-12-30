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
            <h3>DoMyHomework.com</h3>
            <p>Transform how you study with AI-powered tools for learning and academic success.</p>
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
              <li><a href="/refund">Refund Policy</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>Connect</h4>
            <p>Email: info&#64;domyhomework.com</p>
            <p>Follow us on social media</p>
          </div>
        </div>

        <!-- Compliance Disclaimer -->
        <div class="compliance-disclaimer">
          <p>
            <strong>Disclaimer:</strong> The services provided by DoMyHomework.com are meant for research and study assistance purposes only.
            All delivered materials are intended to be used as model papers, sample answers, and reference guides to help students understand
            subject matter and develop their academic skills. Our services are NOT intended to be submitted as the student's own work.
            Customers are responsible for using materials in accordance with their institution's academic integrity policies.
          </p>
        </div>

        <!-- Payment Security -->
        <div class="payment-security">
          <span class="security-item">
            <span class="icon">&#128274;</span>
            Secure SSL Payment
          </span>
          <span class="security-item">
            <span class="icon">&#128179;</span>
            All Major Cards Accepted
          </span>
          <span class="security-item">
            <span class="icon">&#128737;</span>
            60-Day Money Back Guarantee
          </span>
        </div>

        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} DoMyHomework.com - A product of <a href="https://hypothesize.us" target="_blank" rel="noopener">Hypothesize Solutions</a>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      background-color: #31393f;
      color: #fff;
      padding: 3rem 0 1rem;
      margin-top: 4rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    h3 {
      color: #D04A02;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    h4 {
      color: #fff;
      margin-bottom: 1rem;
      font-size: 1.1rem;
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
      color: rgba(255, 255, 255, 0.8);
      transition: color 0.2s ease-in-out;
      text-decoration: none;
    }

    a:hover {
      color: #D04A02;
      text-decoration: none;
    }

    p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 0.5rem;
    }

    /* Compliance Disclaimer */
    .compliance-disclaimer {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
      border-left: 3px solid #D04A02;
    }

    .compliance-disclaimer p {
      font-size: 0.85rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.75);
      margin: 0;
    }

    .compliance-disclaimer strong {
      color: #D04A02;
    }

    /* Payment Security */
    .payment-security {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
      padding: 1.25rem 0;
      margin-bottom: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .security-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.9rem;
    }

    .security-item .icon {
      font-size: 1.25rem;
    }

    .footer-bottom {
      text-align: center;
      padding-top: 1rem;
      color: rgba(255, 255, 255, 0.6);
    }

    .footer-bottom p {
      margin: 0;
      font-size: 0.9rem;
    }

    .footer-bottom a {
      color: #D04A02;
      text-decoration: none;
      font-weight: 500;
    }

    .footer-bottom a:hover {
      text-decoration: underline;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .payment-security {
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
      }

      .footer-content {
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
