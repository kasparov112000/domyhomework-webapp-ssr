import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface ContactInfo {
  icon: string;
  title: string;
  content: string;
  link?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">&#128172;</span>
          <span>We're Here to Help</span>
        </div>
        <h1>Get in Touch</h1>
        <p class="hero-subtitle">
          Have a question, feedback, or need assistance? Our team is ready to help you
          succeed in your academic journey.
        </p>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="contact-container">
        <!-- Contact Form -->
        <div class="form-wrapper">
          <div class="form-header">
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and we'll get back to you within 24 hours.</p>
          </div>

          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
            <!-- Success Message -->
            <div class="success-message" *ngIf="submitSuccess">
              <div class="success-icon">&#9989;</div>
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for contacting us. We'll get back to you within 24-48 hours.</p>
              <button type="button" class="btn-reset" (click)="resetForm()">Send Another Message</button>
            </div>

            <!-- Error Message -->
            <div class="error-message" *ngIf="submitError">
              <div class="error-icon">&#9888;</div>
              <p>{{ submitError }}</p>
            </div>

            <div class="form-content" *ngIf="!submitSuccess">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Full Name <span class="required">*</span></label>
                  <input
                    type="text"
                    id="name"
                    formControlName="name"
                    placeholder="Your full name"
                    [class.error]="contactForm.get('name')?.invalid && contactForm.get('name')?.touched"
                  />
                  <span class="field-error" *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched">
                    Please enter your name
                  </span>
                </div>

                <div class="form-group">
                  <label for="email">Email Address <span class="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    placeholder="your.email@example.com"
                    [class.error]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched"
                  />
                  <span class="field-error" *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched">
                    Please enter a valid email address
                  </span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="phone">Phone Number <span class="optional">(Optional)</span></label>
                  <input
                    type="tel"
                    id="phone"
                    formControlName="phone"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div class="form-group">
                  <label for="subject">Subject <span class="required">*</span></label>
                  <select
                    id="subject"
                    formControlName="subject"
                    [class.error]="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Question">Order Question</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing Issue">Billing Issue</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Partnership">Partnership Opportunity</option>
                    <option value="Other">Other</option>
                  </select>
                  <span class="field-error" *ngIf="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched">
                    Please select a subject
                  </span>
                </div>
              </div>

              <div class="form-group full-width">
                <label for="message">Message <span class="required">*</span></label>
                <textarea
                  id="message"
                  formControlName="message"
                  placeholder="How can we help you? Please provide as much detail as possible..."
                  rows="6"
                  [class.error]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched"
                ></textarea>
                <span class="field-error" *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched">
                  Please enter your message (minimum 10 characters)
                </span>
              </div>

              <button
                type="submit"
                class="btn-submit"
                [disabled]="isSubmitting || contactForm.invalid"
              >
                <span *ngIf="!isSubmitting">Send Message</span>
                <span *ngIf="isSubmitting" class="loading">
                  <span class="spinner"></span>
                  Sending...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Contact Info -->
        <div class="info-wrapper">
          <div class="info-card" *ngFor="let info of contactInfo">
            <div class="info-icon" [innerHTML]="info.icon"></div>
            <h3>{{ info.title }}</h3>
            <p *ngIf="!info.link">{{ info.content }}</p>
            <a *ngIf="info.link" [href]="info.link">{{ info.content }}</a>
          </div>

          <div class="social-card">
            <h3>Follow Us</h3>
            <div class="social-links">
              <a href="#" class="social-link" title="Facebook">&#128101;</a>
              <a href="#" class="social-link" title="Twitter">&#128038;</a>
              <a href="#" class="social-link" title="Instagram">&#128247;</a>
              <a href="#" class="social-link" title="LinkedIn">&#128188;</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="section-header">
        <span class="section-label">FAQ</span>
        <h2>Frequently Asked Questions</h2>
        <p>Quick answers to common questions</p>
      </div>

      <div class="faq-grid">
        <div class="faq-item" *ngFor="let faq of faqs; let i = index" (click)="toggleFaq(i)">
          <div class="faq-question" [class.active]="activeFaq === i">
            <span>{{ faq.question }}</span>
            <span class="faq-icon">{{ activeFaq === i ? '−' : '+' }}</span>
          </div>
          <div class="faq-answer" [class.open]="activeFaq === i">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section (Placeholder) -->
    <section class="map-section">
      <div class="map-content">
        <div class="map-placeholder">
          <span class="map-icon">&#127759;</span>
          <p>Serving students worldwide</p>
        </div>
        <div class="map-info">
          <h3>Global Support</h3>
          <p>Our team operates 24/7 to assist students across all time zones. No matter where you are, we're here to help.</p>
          <div class="support-hours">
            <div class="hours-item">
              <span class="hours-icon">&#128337;</span>
              <div>
                <strong>Response Time</strong>
                <span>Within 24 hours</span>
              </div>
            </div>
            <div class="hours-item">
              <span class="hours-icon">&#127760;</span>
              <div>
                <strong>Coverage</strong>
                <span>All time zones</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to Get Started?</h2>
        <p>Submit your paper today and experience our exceptional academic support</p>
        <div class="cta-buttons">
          <a routerLink="/submit-paper" class="btn-cta-primary">Submit Your Paper</a>
          <a routerLink="/pricing" class="btn-cta-secondary">View Pricing</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }

    .hero-content {
      max-width: 700px;
      margin: 0 auto;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    .badge-icon {
      font-size: 1.1rem;
    }

    .hero-section h1 {
      font-size: 2.75rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      opacity: 0.95;
      line-height: 1.6;
    }

    /* Contact Section */
    .contact-section {
      padding: 4rem 2rem;
      background: #f8f9fa;
    }

    .contact-container {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 3rem;
    }

    .form-wrapper {
      background: white;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .form-header {
      margin-bottom: 2rem;
    }

    .form-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 0.5rem;
    }

    .form-header p {
      color: #666;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      margin-bottom: 1.5rem;
    }

    label {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }

    .required {
      color: #D04A02;
    }

    .optional {
      color: #888;
      font-weight: 400;
      font-size: 0.85rem;
    }

    input, select, textarea {
      padding: 0.875rem 1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s ease;
      font-family: inherit;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #D04A02;
      box-shadow: 0 0 0 3px rgba(208, 74, 2, 0.1);
    }

    input.error, select.error, textarea.error {
      border-color: #dc3545;
    }

    .field-error {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    textarea {
      resize: vertical;
      min-height: 120px;
    }

    select {
      cursor: pointer;
      background: white;
    }

    .btn-submit {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(208, 74, 2, 0.4);
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Success/Error Messages */
    .success-message, .error-message {
      text-align: center;
      padding: 2rem;
      border-radius: 12px;
    }

    .success-message {
      background: #d4edda;
      border: 1px solid #c3e6cb;
    }

    .success-icon, .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .success-message h3 {
      color: #155724;
      margin-bottom: 0.5rem;
    }

    .success-message p {
      color: #155724;
      margin-bottom: 1.5rem;
    }

    .btn-reset {
      background: #28a745;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .btn-reset:hover {
      background: #218838;
    }

    .error-message {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      margin-bottom: 1.5rem;
    }

    .error-message p {
      color: #721c24;
      margin: 0;
    }

    /* Contact Info */
    .info-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .info-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .info-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .info-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 0.5rem;
    }

    .info-card p, .info-card a {
      color: #666;
      font-size: 0.95rem;
      text-decoration: none;
    }

    .info-card a:hover {
      color: #D04A02;
    }

    .social-card {
      background: linear-gradient(135deg, #31393F 0%, #3A434A 100%);
      padding: 1.5rem;
      border-radius: 12px;
      color: white;
    }

    .social-card h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      font-size: 1.25rem;
      transition: all 0.2s ease;
    }

    .social-link:hover {
      background: #D04A02;
      transform: translateY(-2px);
    }

    /* Section Styles */
    .section-label {
      display: inline-block;
      background: rgba(208, 74, 2, 0.1);
      color: #D04A02;
      padding: 0.25rem 1rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-header h2 {
      font-size: 2.25rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 1rem;
    }

    .section-header p {
      font-size: 1.1rem;
      color: #666;
    }

    /* FAQ Section */
    .faq-section {
      padding: 4rem 2rem;
      background: white;
    }

    .faq-grid {
      max-width: 800px;
      margin: 0 auto;
    }

    .faq-item {
      background: #f8f9fa;
      border-radius: 12px;
      margin-bottom: 1rem;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .faq-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
    }

    .faq-question.active {
      background: #D04A02;
      color: white;
    }

    .faq-icon {
      font-size: 1.5rem;
      font-weight: 300;
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .faq-answer.open {
      max-height: 200px;
    }

    .faq-answer p {
      padding: 1rem 1.5rem 1.5rem;
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    /* Map Section */
    .map-section {
      padding: 4rem 2rem;
      background: #f8f9fa;
    }

    .map-content {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
    }

    .map-placeholder {
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      padding: 4rem;
      border-radius: 16px;
      text-align: center;
      color: white;
    }

    .map-icon {
      font-size: 5rem;
      display: block;
      margin-bottom: 1rem;
    }

    .map-placeholder p {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .map-info h3 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 1rem;
    }

    .map-info > p {
      color: #666;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }

    .support-hours {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .hours-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .hours-icon {
      font-size: 1.5rem;
    }

    .hours-item strong {
      display: block;
      color: #1a1a1a;
      font-size: 0.95rem;
    }

    .hours-item span {
      color: #666;
      font-size: 0.9rem;
    }

    /* CTA Section */
    .cta-section {
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      text-align: center;
    }

    .cta-content {
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-content h2 {
      color: white;
      font-size: 2.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-content > p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.15rem;
      margin-bottom: 2rem;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-cta-primary {
      background: white;
      color: #D04A02;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .btn-cta-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .btn-cta-secondary {
      background: transparent;
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      border: 2px solid rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
    }

    .btn-cta-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: white;
    }

    /* Responsive Styles */
    @media (max-width: 1024px) {
      .contact-container {
        grid-template-columns: 1fr;
      }

      .map-content {
        grid-template-columns: 1fr;
      }

      .map-placeholder {
        order: 2;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 3rem 1.5rem;
      }

      .hero-section h1 {
        font-size: 2rem;
      }

      .contact-section,
      .faq-section,
      .map-section,
      .cta-section {
        padding: 3rem 1.5rem;
      }

      .form-wrapper {
        padding: 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .section-header h2 {
        font-size: 1.75rem;
      }

      .cta-content h2 {
        font-size: 1.75rem;
      }
    }

    @media (max-width: 480px) {
      .cta-buttons {
        flex-direction: column;
      }

      .btn-cta-primary,
      .btn-cta-secondary {
        width: 100%;
      }

      .social-links {
        justify-content: center;
      }
    }
  `]
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';
  activeFaq = -1;
  private isBrowser: boolean;
  private apiBaseUrl: string;

  contactInfo: ContactInfo[] = [
    {
      icon: '&#128231;',
      title: 'Email Us',
      content: 'support@learnbytesting.ai',
      link: 'mailto:support@learnbytesting.ai'
    },
    {
      icon: '&#128222;',
      title: 'Live Chat',
      content: 'Available 24/7 for your convenience'
    },
    {
      icon: '&#128337;',
      title: 'Response Time',
      content: 'Within 24 hours on business days'
    },
    {
      icon: '&#127760;',
      title: 'Global Support',
      content: 'Serving students worldwide'
    }
  ];

  faqs: FAQ[] = [
    {
      question: 'How quickly can I expect a response?',
      answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, our live chat support is available 24/7.'
    },
    {
      question: 'How do I track my order status?',
      answer: 'You can track your order status by logging into your account and visiting the "My Orders" section. You\'ll also receive email updates as your order progresses.'
    },
    {
      question: 'What if I\'m not satisfied with my paper?',
      answer: 'We offer unlimited free revisions within 10 days of delivery. If you\'re still not satisfied, we have a 60-day money-back guarantee.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Absolutely. We use bank-level encryption to protect your data and never share your personal information with third parties.'
    },
    {
      question: 'Can I communicate directly with my writer?',
      answer: 'Yes! Once your order is assigned, you can communicate directly with your writer through our secure messaging system.'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.apiBaseUrl = this.getApiBaseUrl();

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {}

  private getApiBaseUrl(): string {
    if (!this.isBrowser) {
      return '';
    }

    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080/api';
    } else {
      return 'https://orchestrator.learnbytesting.ai/api';
    }
  }

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? -1 : index;
  }

  onSubmit(): void {
    if (this.contactForm.invalid || !this.isBrowser) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const formData = this.contactForm.value;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post<any>(`${this.apiBaseUrl}/resend/contact`, formData, { headers })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.submitSuccess = true;
          } else {
            this.submitError = response.error || 'Failed to send message. Please try again.';
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Contact form error:', error);
          this.submitError = error.error?.error || 'An error occurred. Please try again later.';
        }
      });
  }

  resetForm(): void {
    this.contactForm.reset();
    this.submitSuccess = false;
    this.submitError = '';
  }
}
