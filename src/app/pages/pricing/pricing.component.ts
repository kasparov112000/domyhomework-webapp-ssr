import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Transparent Pricing</h1>
        <p class="lead">Clear, fixed pricing for all our academic assistance services. No hidden fees, no surprises.</p>
      </div>
    </section>

    <!-- Pricing Table Section -->
    <section class="pricing-section">
      <div class="container">
        <h2 class="section-title">Our Pricing Structure</h2>
        <p class="section-subtitle">Choose the service level that matches your academic needs</p>

        <!-- Main Pricing Table -->
        <div class="pricing-table-wrapper">
          <table class="pricing-table">
            <thead>
              <tr>
                <th class="service-header">Service Type</th>
                <th>High School</th>
                <th>College / Undergraduate</th>
                <th>Master's / PhD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="service-name">
                  <span class="service-icon">&#9998;</span>
                  <div>
                    <strong>Editing & Proofreading</strong>
                    <small>Grammar, spelling, punctuation, and clarity improvements</small>
                  </div>
                </td>
                <td class="price-cell">
                  <span class="price">$7 - $10</span>
                  <span class="per-unit">per page</span>
                </td>
                <td class="price-cell">
                  <span class="price">$12 - $15</span>
                  <span class="per-unit">per page</span>
                </td>
                <td class="price-cell">
                  <span class="price">$18+</span>
                  <span class="per-unit">per page</span>
                </td>
              </tr>
              <tr>
                <td class="service-name">
                  <span class="service-icon">&#128202;</span>
                  <div>
                    <strong>Problem Solving (Math/STEM)</strong>
                    <small>Step-by-step solutions for math, physics, chemistry, and more</small>
                  </div>
                </td>
                <td class="price-cell">
                  <span class="price">$5 - $8</span>
                  <span class="per-unit">per problem</span>
                </td>
                <td class="price-cell">
                  <span class="price">$10 - $15</span>
                  <span class="per-unit">per problem</span>
                </td>
                <td class="price-cell">
                  <span class="price">Quote Basis</span>
                  <span class="per-unit">contact us</span>
                </td>
              </tr>
              <tr>
                <td class="service-name">
                  <span class="service-icon">&#128214;</span>
                  <div>
                    <strong>Research & Model Papers*</strong>
                    <small>Original research assistance and sample papers for study reference</small>
                  </div>
                </td>
                <td class="price-cell">
                  <span class="price">$12 - $15</span>
                  <span class="per-unit">per page</span>
                </td>
                <td class="price-cell">
                  <span class="price">$18 - $22</span>
                  <span class="per-unit">per page</span>
                </td>
                <td class="price-cell">
                  <span class="price">$28+</span>
                  <span class="per-unit">per page</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="model-paper-note">
          <strong>*Note on Model Papers:</strong> All written content provided by DoMyHomework.com is delivered as a
          <strong>"Model Answer"</strong> or <strong>"Sample Paper for Research Purposes Only."</strong>
          These materials are intended to serve as study aids, examples, and references for your own original work.
        </p>

        <!-- Price Factors -->
        <div class="price-factors">
          <h3>Pricing Factors</h3>
          <div class="factors-grid">
            <div class="factor-card">
              <span class="factor-icon">&#128198;</span>
              <h4>Deadline</h4>
              <p>Urgent orders (24-48 hours) may incur additional fees. Standard delivery (5-7 days) offers the best rates.</p>
            </div>
            <div class="factor-card">
              <span class="factor-icon">&#128203;</span>
              <h4>Complexity</h4>
              <p>Technical subjects, specialized topics, or advanced research requirements may affect pricing.</p>
            </div>
            <div class="factor-card">
              <span class="factor-icon">&#128221;</span>
              <h4>Length</h4>
              <p>Volume discounts available for larger orders. Contact us for custom quotes on extensive projects.</p>
            </div>
            <div class="factor-card">
              <span class="factor-icon">&#9889;</span>
              <h4>Extras</h4>
              <p>Add-on services like plagiarism reports, priority support, or additional revisions available.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What's Included Section -->
    <section class="included-section">
      <div class="container">
        <h2 class="section-title">What's Included</h2>
        <div class="included-grid">
          <div class="included-item">
            <span class="check-icon">&#10003;</span>
            <span>Free Title Page</span>
          </div>
          <div class="included-item">
            <span class="check-icon">&#10003;</span>
            <span>Free Bibliography</span>
          </div>
          <div class="included-item">
            <span class="check-icon">&#10003;</span>
            <span>Free Revisions</span>
          </div>
          <div class="included-item">
            <span class="check-icon">&#10003;</span>
            <span>24/7 Support</span>
          </div>
          <div class="included-item">
            <span class="check-icon">&#10003;</span>
            <span>Plagiarism-Free Guarantee</span>
          </div>
          <div class="included-item">
            <span class="check-icon">&#10003;</span>
            <span>On-Time Delivery</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Money Back Guarantee -->
    <section class="guarantee-section">
      <div class="container">
        <div class="guarantee-card">
          <span class="shield-icon">&#128737;</span>
          <div class="guarantee-content">
            <h3>60-Day Money Back Guarantee</h3>
            <p>We stand behind the quality of our work. If you're not satisfied with our service,
               we offer a full refund within 60 days of delivery. Your satisfaction is our priority.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Get Started?</h2>
        <p>Get a personalized quote for your specific project requirements.</p>
        <div class="cta-buttons">
          <a routerLink="/order" class="btn btn-primary">Place an Order</a>
          <a routerLink="/contact" class="btn btn-outline">Contact Us</a>
        </div>
      </div>
    </section>

    <!-- Compliance Disclaimer Section -->
    <section class="disclaimer-section">
      <div class="container">
        <!-- Main Academic Disclaimer -->
        <div class="disclaimer-box primary-disclaimer">
          <h3>Academic Integrity & Service Disclaimer</h3>
          <p>
            <strong>IMPORTANT:</strong> The services provided by DoMyHomework.com, operated by Hypothesize Solutions LLC,
            are intended <strong>exclusively for research, study assistance, and educational reference purposes</strong>.
            All materials delivered through our platform are provided as:
          </p>
          <ul class="disclaimer-list">
            <li><strong>Model Answers</strong> - Examples demonstrating proper structure, formatting, and approach</li>
            <li><strong>Sample Papers</strong> - Reference documents for research and learning purposes only</li>
            <li><strong>Study Guides</strong> - Educational materials to aid comprehension and skill development</li>
            <li><strong>Tutoring Resources</strong> - Step-by-step explanations to support learning</li>
          </ul>
          <p class="highlight-text">
            <strong>Our services are NOT intended to be submitted as the customer's own work.</strong>
            All customers are solely responsible for ensuring their use of our materials complies with their
            educational institution's academic integrity policies, honor codes, and applicable laws.
          </p>
        </div>

        <!-- Customer Responsibility -->
        <div class="disclaimer-box">
          <h3>Customer Acknowledgment & Responsibility</h3>
          <p>By placing an order and using our services, you acknowledge and agree that:</p>
          <ul class="disclaimer-list">
            <li>You are at least <strong>18 years of age</strong> or have parental/guardian consent</li>
            <li>You will use all delivered materials <strong>only as reference and study aids</strong></li>
            <li>You understand that submitting our work as your own may violate academic policies</li>
            <li>You accept <strong>full responsibility</strong> for how you choose to use our materials</li>
            <li>You will not hold DoMyHomework.com or its affiliates liable for any misuse of materials</li>
            <li>You have read and agree to our <a routerLink="/terms">Terms of Service</a> and <a routerLink="/refund">Refund Policy</a></li>
          </ul>
        </div>

        <!-- Payment & Refund Policy -->
        <div class="disclaimer-box">
          <h3>Payment Terms & Refund Policy</h3>
          <p>
            <strong>Payment Processing:</strong> All payments are processed securely through our authorized payment partners.
            By completing a purchase, you authorize DoMyHomework.com to charge your payment method for the agreed amount.
          </p>
          <p>
            <strong>60-Day Money Back Guarantee:</strong> We offer a full refund within 60 days if:
          </p>
          <ul class="disclaimer-list">
            <li>The delivered work does not meet the specifications outlined in your order</li>
            <li>The work is not delivered by the agreed deadline (excluding customer-caused delays)</li>
            <li>Quality issues that cannot be resolved through our free revision process</li>
          </ul>
          <p>
            <strong>Chargeback Policy:</strong> We encourage customers to contact our support team before initiating
            any payment disputes. We are committed to resolving issues promptly and fairly. Fraudulent chargebacks
            may result in account termination and collection actions.
          </p>
        </div>

        <!-- Limitation of Liability -->
        <div class="disclaimer-box">
          <h3>Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, DoMyHomework.com, Hypothesize Solutions LLC, its owners, employees,
            affiliates, partners, and payment processing providers shall not be liable for:
          </p>
          <ul class="disclaimer-list">
            <li>Any academic consequences resulting from improper use of our materials</li>
            <li>Disciplinary actions taken by educational institutions</li>
            <li>Any indirect, incidental, special, or consequential damages</li>
            <li>Loss of grades, academic standing, or employment opportunities</li>
          </ul>
          <p>
            Our maximum liability for any claim shall not exceed the amount paid for the specific service in question.
          </p>
        </div>

        <!-- Contact Information -->
        <div class="disclaimer-box contact-box">
          <h3>Contact Us</h3>
          <p>
            If you have any questions about our services, policies, or need assistance, please contact us:
          </p>
          <div class="contact-info">
            <p><strong>Email:</strong> support&#64;domyhomework.com</p>
            <p><strong>Business:</strong> Hypothesize Solutions LLC</p>
            <p><strong>Response Time:</strong> Within 24 hours</p>
          </div>
        </div>

        <!-- Payment Security Badges -->
        <div class="security-badges">
          <div class="badge">
            <span class="badge-icon">&#128274;</span>
            <span>256-bit SSL Encryption</span>
          </div>
          <div class="badge">
            <span class="badge-icon">&#128179;</span>
            <span>Visa, Mastercard, Amex, Discover</span>
          </div>
          <div class="badge">
            <span class="badge-icon">&#128737;</span>
            <span>60-Day Money Back Guarantee</span>
          </div>
          <div class="badge">
            <span class="badge-icon">&#9989;</span>
            <span>PCI-DSS Compliant</span>
          </div>
        </div>

        <!-- Legal Footer -->
        <p class="legal-footer">
          &copy; {{ currentYear }} DoMyHomework.com - A service of Hypothesize Solutions LLC. All rights reserved.
          Use of this website constitutes acceptance of our <a routerLink="/terms">Terms of Service</a>,
          <a routerLink="/privacy">Privacy Policy</a>, and <a routerLink="/refund">Refund Policy</a>.
        </p>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      color: white;
      padding: 4rem 0;
      text-align: center;
    }

    .hero h1 {
      font-size: 2.75rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero .lead {
      font-size: 1.25rem;
      opacity: 0.95;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Container */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Section Styling */
    .pricing-section {
      padding: 4rem 0;
      background: #fafafa;
    }

    .section-title {
      text-align: center;
      font-size: 2rem;
      font-weight: 700;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .section-subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 2.5rem;
    }

    /* Pricing Table */
    .pricing-table-wrapper {
      overflow-x: auto;
      margin-bottom: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .pricing-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      min-width: 700px;
    }

    .pricing-table thead {
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
    }

    .pricing-table th {
      padding: 1.25rem 1rem;
      color: white;
      font-weight: 600;
      text-align: center;
      font-size: 0.95rem;
    }

    .pricing-table th.service-header {
      text-align: left;
      min-width: 280px;
    }

    .pricing-table tbody tr {
      border-bottom: 1px solid #eee;
      transition: background-color 0.2s ease;
    }

    .pricing-table tbody tr:hover {
      background-color: #fafafa;
    }

    .pricing-table tbody tr:last-child {
      border-bottom: none;
    }

    .pricing-table td {
      padding: 1.25rem 1rem;
    }

    .service-name {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .service-icon {
      font-size: 1.75rem;
      min-width: 40px;
    }

    .service-name strong {
      display: block;
      color: #333;
      font-size: 1rem;
      margin-bottom: 0.25rem;
    }

    .service-name small {
      display: block;
      color: #666;
      font-size: 0.85rem;
      line-height: 1.4;
    }

    .price-cell {
      text-align: center;
      vertical-align: middle;
    }

    .price {
      display: block;
      font-size: 1.25rem;
      font-weight: 700;
      color: #D04A02;
    }

    .per-unit {
      display: block;
      font-size: 0.8rem;
      color: #888;
      margin-top: 0.25rem;
    }

    /* Model Paper Note */
    .model-paper-note {
      background: #fff3e0;
      border-left: 4px solid #D04A02;
      padding: 1rem 1.5rem;
      margin: 1.5rem 0 3rem;
      border-radius: 0 8px 8px 0;
      font-size: 0.95rem;
      color: #333;
    }

    /* Price Factors */
    .price-factors {
      margin-top: 3rem;
    }

    .price-factors h3 {
      text-align: center;
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .factors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .factor-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
      text-align: center;
    }

    .factor-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 0.75rem;
    }

    .factor-card h4 {
      color: #333;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .factor-card p {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }

    /* Included Section */
    .included-section {
      padding: 4rem 0;
      background: white;
    }

    .included-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .included-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .check-icon {
      color: #4CAF50;
      font-size: 1.25rem;
      font-weight: bold;
    }

    .included-item span:last-child {
      color: #333;
      font-weight: 500;
    }

    /* Guarantee Section */
    .guarantee-section {
      padding: 3rem 0;
      background: #fafafa;
    }

    .guarantee-card {
      display: flex;
      align-items: center;
      gap: 2rem;
      background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      max-width: 800px;
      margin: 0 auto;
    }

    .shield-icon {
      font-size: 3.5rem;
      min-width: 80px;
      text-align: center;
    }

    .guarantee-content h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .guarantee-content p {
      margin: 0;
      opacity: 0.95;
      line-height: 1.6;
    }

    /* CTA Section */
    .cta-section {
      padding: 4rem 0;
      background: #31393f;
      color: white;
      text-align: center;
    }

    .cta-section h2 {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }

    .cta-section p {
      opacity: 0.9;
      margin-bottom: 2rem;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-block;
      padding: 0.875rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      border-radius: 6px;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .btn-primary {
      background: #D04A02;
      color: white;
      border: 2px solid #D04A02;
    }

    .btn-primary:hover {
      background: #B03902;
      border-color: #B03902;
    }

    .btn-outline {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-outline:hover {
      background: white;
      color: #31393f;
    }

    /* Disclaimer Section */
    .disclaimer-section {
      padding: 4rem 0;
      background: #fafafa;
    }

    .disclaimer-box {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .disclaimer-box h3 {
      color: #333;
      font-size: 1.25rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .disclaimer-box h3::before {
      content: "\\26A0";
      font-size: 1.5rem;
    }

    .disclaimer-box p {
      color: #555;
      line-height: 1.7;
      margin-bottom: 1rem;
      font-size: 0.95rem;
    }

    .disclaimer-box p:last-child {
      margin-bottom: 0;
    }

    /* Security Badges */
    .security-badges {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .badge-icon {
      font-size: 1.5rem;
    }

    /* Enhanced Disclaimer Styles */
    .primary-disclaimer {
      border-left: 4px solid #D04A02;
      background: linear-gradient(to right, #fff8f5, white);
    }

    .disclaimer-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }

    .disclaimer-list li {
      padding: 0.5rem 0 0.5rem 1.75rem;
      position: relative;
      color: #555;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .disclaimer-list li::before {
      content: "\\2713";
      position: absolute;
      left: 0;
      color: #4CAF50;
      font-weight: bold;
    }

    .highlight-text {
      background: #fff3e0;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #ffcc80;
      margin-top: 1rem;
    }

    .contact-box {
      background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%);
      border: 1px solid #ddd;
    }

    .contact-box h3::before {
      content: "\\2709";
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .contact-info p {
      margin: 0;
      padding: 0.5rem;
      background: white;
      border-radius: 6px;
      border: 1px solid #eee;
    }

    .legal-footer {
      text-align: center;
      color: #888;
      font-size: 0.85rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }

    .legal-footer a {
      color: #D04A02;
      text-decoration: none;
    }

    .legal-footer a:hover {
      text-decoration: underline;
    }

    .disclaimer-box a {
      color: #D04A02;
      text-decoration: none;
      font-weight: 500;
    }

    .disclaimer-box a:hover {
      text-decoration: underline;
    }

    /* Responsive Styles */
    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .hero .lead {
        font-size: 1.1rem;
      }

      .section-title {
        font-size: 1.5rem;
      }

      .guarantee-card {
        flex-direction: column;
        text-align: center;
      }

      .shield-icon {
        min-width: auto;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn {
        width: 100%;
        max-width: 280px;
        text-align: center;
      }

      .security-badges {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
    }
  `]
})
export class PricingComponent {
  currentYear = new Date().getFullYear();
}
