import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Terms of Service</h1>
        <p class="hero-subtitle">
          Please read these terms carefully before using our services.
          By using DoMyHomework.com, you agree to be bound by these terms.
        </p>
        <p class="last-updated">Last Updated: January 6, 2026</p>
      </div>
    </section>

    <!-- Terms Content -->
    <section class="terms-section">
      <div class="terms-container">
        <!-- Important Notice -->
        <div class="important-notice">
          <div class="notice-icon">&#9888;</div>
          <div class="notice-content">
            <h3>Important Notice Regarding Academic Integrity</h3>
            <p>
              The services provided by DoMyHomework.com are meant for <strong>research and study assistance purposes only</strong>.
              All delivered materials are intended to be used as model papers, sample answers, and reference guides to help
              students understand subject matter and develop their academic skills. Our services are <strong>NOT</strong> intended
              to be submitted as the student's own work. Customers are responsible for using materials in accordance with
              their institution's academic integrity policies.
            </p>
          </div>
        </div>

        <!-- Table of Contents -->
        <div class="toc">
          <h3>Table of Contents</h3>
          <ol>
            <li><a href="#acceptance">Acceptance of Terms</a></li>
            <li><a href="#services">Description of Services</a></li>
            <li><a href="#intended-use">Intended Use of Materials</a></li>
            <li><a href="#prohibited-use">Prohibited Uses</a></li>
            <li><a href="#user-responsibilities">User Responsibilities</a></li>
            <li><a href="#ordering">Ordering Process</a></li>
            <li><a href="#payment">Payment Terms</a></li>
            <li><a href="#refunds">Refund Policy</a></li>
            <li><a href="#intellectual-property">Intellectual Property</a></li>
            <li><a href="#confidentiality">Confidentiality & Privacy</a></li>
            <li><a href="#disclaimers">Disclaimers & Limitations</a></li>
            <li><a href="#termination">Termination</a></li>
            <li><a href="#changes">Changes to Terms</a></li>
            <li><a href="#contact">Contact Information</a></li>
          </ol>
        </div>

        <!-- Section 1 -->
        <div class="terms-block" id="acceptance">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the DoMyHomework.com website and services ("Services"), you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms,
            you must not use our Services.
          </p>
          <p>
            These Terms constitute a legally binding agreement between you ("User," "Customer," or "you") and Hypothesize Solutions
            ("Company," "we," "us," or "our"), the operator of DoMyHomework.com.
          </p>
          <p>
            You must be at least 18 years of age or the age of majority in your jurisdiction to use our Services.
            By using our Services, you represent and warrant that you meet this requirement.
          </p>
        </div>

        <!-- Section 2 -->
        <div class="terms-block" id="services">
          <h2>2. Description of Services</h2>
          <p>
            DoMyHomework.com provides academic research and study assistance services, including but not limited to:
          </p>
          <ul>
            <li><strong>Research Papers & Essays:</strong> Custom-written research materials on various academic topics</li>
            <li><strong>Problem Solving:</strong> Step-by-step solutions to mathematical, scientific, and technical problems</li>
            <li><strong>Study Guides:</strong> Comprehensive study materials and subject summaries</li>
            <li><strong>Editing & Proofreading:</strong> Review and improvement suggestions for existing work</li>
            <li><strong>Tutoring Assistance:</strong> Explanations and guidance on academic concepts</li>
            <li><strong>Reference Materials:</strong> Sample papers and model answers for educational purposes</li>
          </ul>
          <p>
            Our services are designed to supplement your learning experience and provide guidance in understanding
            complex academic subjects.
          </p>
        </div>

        <!-- Section 3 -->
        <div class="terms-block" id="intended-use">
          <h2>3. Intended Use of Materials</h2>
          <p>
            <strong>All materials provided by DoMyHomework.com are intended solely for the following purposes:</strong>
          </p>
          <div class="use-grid">
            <div class="use-item allowed">
              <div class="use-icon">&#10004;</div>
              <h4>Permitted Uses</h4>
              <ul>
                <li>Research reference and source material</li>
                <li>Study aids to understand complex topics</li>
                <li>Model papers to learn proper structure and formatting</li>
                <li>Sample answers to guide your own work</li>
                <li>Learning tools to improve academic skills</li>
                <li>Inspiration for developing your own ideas</li>
                <li>Understanding different perspectives on topics</li>
              </ul>
            </div>
            <div class="use-item prohibited">
              <div class="use-icon">&#10006;</div>
              <h4>Prohibited Uses</h4>
              <ul>
                <li>Submitting as your own original work</li>
                <li>Representing materials as self-authored</li>
                <li>Violating academic integrity policies</li>
                <li>Plagiarism or academic dishonesty</li>
                <li>Any use that violates institutional rules</li>
                <li>Reselling or redistributing materials</li>
                <li>Commercial use without authorization</li>
              </ul>
            </div>
          </div>
          <p class="emphasis">
            By using our Services, you acknowledge that you understand and will comply with these intended use guidelines.
            You accept full responsibility for how you use the materials we provide.
          </p>
        </div>

        <!-- Section 4 -->
        <div class="terms-block" id="prohibited-use">
          <h2>4. Prohibited Uses</h2>
          <p>You agree NOT to use our Services to:</p>
          <ul>
            <li>Submit delivered materials as your own work to any educational institution</li>
            <li>Violate any applicable laws, regulations, or third-party rights</li>
            <li>Engage in any form of academic fraud or dishonesty</li>
            <li>Misrepresent the origin or authorship of delivered materials</li>
            <li>Use our Services for any illegal or unauthorized purpose</li>
            <li>Harass, abuse, or harm our staff, writers, or other users</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the integrity of our Services</li>
            <li>Share account credentials with unauthorized parties</li>
            <li>Use automated systems to access our Services without permission</li>
          </ul>
          <p>
            Violation of these prohibitions may result in immediate termination of your account and forfeiture of any
            payments made, without refund.
          </p>
        </div>

        <!-- Section 5 -->
        <div class="terms-block" id="user-responsibilities">
          <h2>5. User Responsibilities</h2>
          <p>As a user of our Services, you are responsible for:</p>
          <ul>
            <li><strong>Academic Integrity:</strong> Understanding and complying with your institution's academic integrity
            policies and honor codes</li>
            <li><strong>Proper Use:</strong> Using delivered materials only as reference, study aids, or learning tools</li>
            <li><strong>Accurate Information:</strong> Providing accurate order details, requirements, and contact information</li>
            <li><strong>Timely Communication:</strong> Responding promptly to questions from our team regarding your orders</li>
            <li><strong>Review & Verification:</strong> Reviewing delivered materials and requesting revisions within the
            specified timeframe if needed</li>
            <li><strong>Account Security:</strong> Maintaining the confidentiality of your account credentials</li>
            <li><strong>Legal Compliance:</strong> Ensuring your use of our Services complies with all applicable laws</li>
          </ul>
        </div>

        <!-- Section 6 -->
        <div class="terms-block" id="ordering">
          <h2>6. Ordering Process</h2>
          <p>When placing an order through our platform:</p>
          <ol>
            <li><strong>Order Submission:</strong> You must provide complete and accurate details about your research needs,
            including topic, requirements, academic level, and deadline.</li>
            <li><strong>Price Quote:</strong> You will receive a price quote based on the complexity, length, and deadline
            of your order. Prices are final once confirmed.</li>
            <li><strong>Payment:</strong> Full or partial payment (as applicable) is required before work begins.</li>
            <li><strong>Assignment:</strong> We will assign a qualified researcher/writer to your project.</li>
            <li><strong>Communication:</strong> You may communicate with our team through our messaging system for clarifications.</li>
            <li><strong>Delivery:</strong> Completed work will be delivered by the agreed deadline.</li>
            <li><strong>Revisions:</strong> You may request revisions within the specified revision period if the delivered
            work does not meet the original requirements.</li>
          </ol>
        </div>

        <!-- Section 7 -->
        <div class="terms-block" id="payment">
          <h2>7. Payment Terms</h2>
          <ul>
            <li>All prices are quoted in US Dollars (USD) unless otherwise specified</li>
            <li>Payment must be made through our approved payment methods</li>
            <li>We accept major credit cards, debit cards, and other electronic payment methods</li>
            <li>All transactions are processed through secure, encrypted payment gateways</li>
            <li>Prices may vary based on academic level, complexity, length, and deadline</li>
            <li>Rush orders may incur additional fees</li>
            <li>Payment constitutes acceptance of your order and these Terms</li>
          </ul>
        </div>

        <!-- Section 8 -->
        <div class="terms-block" id="refunds">
          <h2>8. Refund Policy</h2>
          <p>We strive for complete customer satisfaction. Our refund policy is as follows:</p>
          <ul>
            <li><strong>Full Refund:</strong> Available if you cancel before a writer is assigned to your order</li>
            <li><strong>Partial Refund:</strong> May be available if work has begun but is not yet complete, calculated
            based on work completed</li>
            <li><strong>Quality Issues:</strong> If delivered work does not meet the agreed requirements and cannot be
            resolved through revisions, a partial or full refund may be issued</li>
            <li><strong>Late Delivery:</strong> Compensation may be provided for significantly late deliveries, determined
            on a case-by-case basis</li>
            <li><strong>No Refund:</strong> Refunds are not available after you have downloaded and accepted the final work,
            or if you misused the materials in violation of these Terms</li>
          </ul>
          <p>
            Refund requests must be submitted within 14 days of delivery. Each request is evaluated individually
            based on the circumstances.
          </p>
          <p>
            <a routerLink="/refund-policy" class="policy-link">View our complete Refund Policy</a>
          </p>
        </div>

        <!-- Section 9 -->
        <div class="terms-block" id="intellectual-property">
          <h2>9. Intellectual Property</h2>
          <p>
            Upon full payment and delivery, you receive a non-exclusive license to use the delivered materials for
            personal, educational reference purposes as outlined in Section 3 (Intended Use of Materials).
          </p>
          <ul>
            <li>You may not claim authorship of delivered materials</li>
            <li>You may not publish, distribute, or resell delivered materials</li>
            <li>We retain the right to use anonymized versions of delivered work for quality assurance and training purposes</li>
            <li>All website content, logos, and branding remain the property of Hypothesize Solutions</li>
            <li>Source materials and references used in research remain subject to their original copyright holders</li>
          </ul>
        </div>

        <!-- Section 10 -->
        <div class="terms-block" id="confidentiality">
          <h2>10. Confidentiality & Privacy</h2>
          <p>We are committed to protecting your privacy:</p>
          <ul>
            <li>Your personal information will never be shared with third parties except as required to provide our Services</li>
            <li>Order details and delivered materials are kept confidential</li>
            <li>We use industry-standard security measures to protect your data</li>
            <li>You may request deletion of your account and associated data at any time</li>
          </ul>
          <p>
            For complete details on how we collect, use, and protect your information, please review our
            <a routerLink="/privacy-policy" class="policy-link">Privacy Policy</a>.
          </p>
        </div>

        <!-- Section 11 -->
        <div class="terms-block" id="disclaimers">
          <h2>11. Disclaimers & Limitations of Liability</h2>
          <div class="disclaimer-box">
            <p>
              <strong>EDUCATIONAL PURPOSE ONLY:</strong> Our Services are provided for research, learning, and educational
              reference purposes only. We do not condone, encourage, or support academic dishonesty, plagiarism, or
              any violation of academic integrity policies.
            </p>
          </div>
          <p>
            <strong>AS-IS BASIS:</strong> Our Services are provided on an "as is" and "as available" basis without
            warranties of any kind, either express or implied, including but not limited to implied warranties of
            merchantability, fitness for a particular purpose, or non-infringement.
          </p>
          <p>
            <strong>LIMITATION OF LIABILITY:</strong> To the maximum extent permitted by law, Hypothesize Solutions and
            its affiliates, officers, employees, agents, and partners shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, including but not limited to loss of profits, data, use,
            goodwill, or other intangible losses resulting from:
          </p>
          <ul>
            <li>Your use or inability to use our Services</li>
            <li>Any conduct or content of any third party on our Services</li>
            <li>Any content obtained from our Services</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            <li>Any academic consequences resulting from your use or misuse of delivered materials</li>
          </ul>
          <p>
            <strong>YOU ASSUME FULL RESPONSIBILITY</strong> for how you use materials obtained through our Services,
            including any academic, professional, or legal consequences that may result.
          </p>
        </div>

        <!-- Section 12 -->
        <div class="terms-block" id="termination">
          <h2>12. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access to our Services at any time, without prior notice,
            for any reason, including but not limited to:
          </p>
          <ul>
            <li>Violation of these Terms</li>
            <li>Fraudulent or illegal activity</li>
            <li>Abusive behavior toward our staff or other users</li>
            <li>Providing false information</li>
            <li>Non-payment or payment disputes</li>
          </ul>
          <p>
            Upon termination, your right to use our Services will immediately cease. Provisions of these Terms that
            by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers,
            indemnity, and limitations of liability.
          </p>
        </div>

        <!-- Section 13 -->
        <div class="terms-block" id="changes">
          <h2>13. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting
            to this page. We will update the "Last Updated" date at the top of these Terms to reflect the date of the
            most recent changes.
          </p>
          <p>
            Your continued use of our Services after any changes to these Terms constitutes your acceptance of the
            new Terms. We encourage you to review these Terms periodically.
          </p>
        </div>

        <!-- Section 14 -->
        <div class="terms-block" id="contact">
          <h2>14. Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us:</p>
          <div class="contact-info">
            <p><strong>Email:</strong> <a href="mailto:legal&#64;domyhomework.com">legal&#64;domyhomework.com</a></p>
            <p><strong>General Inquiries:</strong> <a href="mailto:info&#64;domyhomework.com">info&#64;domyhomework.com</a></p>
            <p><strong>Website:</strong> <a href="https://domyhomework.com">domyhomework.com</a></p>
          </div>
          <p>
            For questions about orders, refunds, or other customer service matters, please visit our
            <a routerLink="/contact" class="policy-link">Contact Page</a>.
          </p>
        </div>

        <!-- Final Agreement -->
        <div class="final-agreement">
          <h3>Agreement</h3>
          <p>
            By using DoMyHomework.com, you acknowledge that you have read, understood, and agree to be bound by these
            Terms of Service. You also acknowledge that you have read and understand our
            <a routerLink="/privacy-policy">Privacy Policy</a>, <a routerLink="/refund-policy">Refund Policy</a>, and
            <a routerLink="/cookie-policy">Cookie Policy</a>.
          </p>
          <p class="company-info">
            DoMyHomework.com is a product of <a href="https://hypothesize.us" target="_blank">Hypothesize Solutions</a>.
            All rights reserved.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Have Questions?</h2>
        <p>Our support team is here to help you understand our services and policies.</p>
        <div class="cta-buttons">
          <a routerLink="/contact" class="btn btn-primary">Contact Us</a>
          <a routerLink="/about" class="btn btn-secondary">Learn About Us</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      padding: 80px 20px 60px;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-content h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      line-height: 1.6;
      margin-bottom: 15px;
    }

    .last-updated {
      font-size: 0.9rem;
      opacity: 0.7;
    }

    /* Terms Section */
    .terms-section {
      padding: 60px 20px;
      background: #f8f9fa;
    }

    .terms-container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      padding: 40px;
    }

    /* Important Notice */
    .important-notice {
      background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
      border-left: 4px solid #e65100;
      border-radius: 8px;
      padding: 25px;
      margin-bottom: 40px;
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .notice-icon {
      font-size: 2rem;
      flex-shrink: 0;
    }

    .notice-content h3 {
      color: #e65100;
      margin: 0 0 12px 0;
      font-size: 1.2rem;
    }

    .notice-content p {
      margin: 0;
      line-height: 1.7;
      color: #5d4037;
    }

    /* Table of Contents */
    .toc {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 25px 30px;
      margin-bottom: 40px;
    }

    .toc h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 1.1rem;
    }

    .toc ol {
      margin: 0;
      padding-left: 20px;
      columns: 2;
      column-gap: 40px;
    }

    .toc li {
      margin-bottom: 8px;
      break-inside: avoid;
    }

    .toc a {
      color: #e65100;
      text-decoration: none;
      font-size: 0.95rem;
    }

    .toc a:hover {
      text-decoration: underline;
    }

    /* Terms Blocks */
    .terms-block {
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid #eee;
    }

    .terms-block:last-of-type {
      border-bottom: none;
    }

    .terms-block h2 {
      color: #1a1a2e;
      font-size: 1.4rem;
      margin-bottom: 20px;
      padding-top: 20px;
    }

    .terms-block p {
      line-height: 1.8;
      color: #444;
      margin-bottom: 15px;
    }

    .terms-block ul, .terms-block ol {
      margin: 15px 0;
      padding-left: 25px;
    }

    .terms-block li {
      line-height: 1.8;
      color: #444;
      margin-bottom: 10px;
    }

    .terms-block li strong {
      color: #333;
    }

    /* Use Grid */
    .use-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 25px;
      margin: 25px 0;
    }

    .use-item {
      border-radius: 10px;
      padding: 25px;
    }

    .use-item.allowed {
      background: #e8f5e9;
      border: 1px solid #a5d6a7;
    }

    .use-item.prohibited {
      background: #ffebee;
      border: 1px solid #ef9a9a;
    }

    .use-icon {
      font-size: 1.5rem;
      margin-bottom: 10px;
    }

    .use-item.allowed .use-icon {
      color: #2e7d32;
    }

    .use-item.prohibited .use-icon {
      color: #c62828;
    }

    .use-item h4 {
      margin: 0 0 15px 0;
      font-size: 1.1rem;
    }

    .use-item.allowed h4 {
      color: #2e7d32;
    }

    .use-item.prohibited h4 {
      color: #c62828;
    }

    .use-item ul {
      margin: 0;
      padding-left: 20px;
    }

    .use-item li {
      font-size: 0.95rem;
      margin-bottom: 8px;
    }

    .emphasis {
      background: #fff8e1;
      padding: 15px 20px;
      border-radius: 8px;
      border-left: 4px solid #ffc107;
      font-weight: 500;
    }

    /* Disclaimer Box */
    .disclaimer-box {
      background: #fce4ec;
      border: 1px solid #f48fb1;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .disclaimer-box p {
      margin: 0;
      color: #880e4f;
    }

    /* Policy Links */
    .policy-link {
      color: #e65100;
      text-decoration: none;
      font-weight: 500;
    }

    .policy-link:hover {
      text-decoration: underline;
    }

    /* Contact Info */
    .contact-info {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }

    .contact-info p {
      margin: 8px 0;
    }

    .contact-info a {
      color: #e65100;
      text-decoration: none;
    }

    .contact-info a:hover {
      text-decoration: underline;
    }

    /* Final Agreement */
    .final-agreement {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border-radius: 10px;
      padding: 30px;
      margin-top: 40px;
      text-align: center;
    }

    .final-agreement h3 {
      color: #1565c0;
      margin: 0 0 15px 0;
    }

    .final-agreement p {
      margin: 0 0 15px 0;
      line-height: 1.7;
    }

    .final-agreement a {
      color: #e65100;
      text-decoration: none;
    }

    .final-agreement a:hover {
      text-decoration: underline;
    }

    .company-info {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-top: 20px !important;
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, #e65100 0%, #ff6d00 100%);
      padding: 60px 20px;
      text-align: center;
    }

    .cta-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-content h2 {
      color: white;
      font-size: 2rem;
      margin-bottom: 15px;
    }

    .cta-content p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      margin-bottom: 25px;
    }

    .cta-buttons {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: white;
      color: #e65100;
    }

    .btn-primary:hover {
      background: #f5f5f5;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 1.8rem;
      }

      .terms-container {
        padding: 25px;
      }

      .important-notice {
        flex-direction: column;
        text-align: center;
      }

      .toc ol {
        columns: 1;
      }

      .use-grid {
        grid-template-columns: 1fr;
      }

      .cta-content h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class TermsComponent {}
