import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface TeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">&#127891;</span>
          <span>Est. 2018</span>
        </div>
        <h1>Empowering Students to Achieve Their Full Potential</h1>
        <p class="hero-subtitle">
          We believe every student deserves access to high-quality academic support.
          Our mission is to make expert help accessible, affordable, and stress-free.
        </p>
      </div>
      <div class="hero-wave">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8f9fa"/>
        </svg>
      </div>
    </section>

    <!-- Our Story Section -->
    <section class="story-section">
      <div class="story-content">
        <div class="story-text">
          <span class="section-label">Our Story</span>
          <h2>From a Simple Idea to a Global Community</h2>
          <p>
            DoMyHomework.com was founded in 2018 by a group of graduate students who understood
            the challenges of academic life firsthand. Late nights, overwhelming deadlines, and
            the constant pressure to excel - we've been there.
          </p>
          <p>
            What started as a small tutoring service has grown into a comprehensive academic
            support platform serving over 50,000 students worldwide. Our journey has been
            driven by one simple belief: everyone deserves a chance to succeed.
          </p>
          <p>
            Today, we work with 500+ expert writers and researchers from top universities,
            offering support across 50+ subject areas. But our core mission remains the same -
            helping students learn, grow, and achieve their academic goals.
          </p>
        </div>
        <div class="story-image">
          <div class="image-placeholder">
            <div class="placeholder-content">
              <span class="placeholder-icon">&#127891;</span>
              <span class="placeholder-text">Academic Excellence</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-item" *ngFor="let stat of stats">
          <div class="stat-number">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="section-header">
        <span class="section-label">What We Stand For</span>
        <h2>Our Core Values</h2>
        <p>These principles guide everything we do</p>
      </div>

      <div class="values-grid">
        <div class="value-card" *ngFor="let value of values">
          <div class="value-icon" [innerHTML]="value.icon"></div>
          <h3>{{ value.title }}</h3>
          <p>{{ value.description }}</p>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="timeline-section">
      <div class="section-header light">
        <span class="section-label">Our Journey</span>
        <h2>Milestones We're Proud Of</h2>
        <p>A timeline of growth and achievement</p>
      </div>

      <div class="timeline">
        <div class="timeline-item" *ngFor="let milestone of milestones; let i = index" [class.right]="i % 2 !== 0">
          <div class="timeline-content">
            <span class="timeline-year">{{ milestone.year }}</span>
            <h3>{{ milestone.title }}</h3>
            <p>{{ milestone.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="section-header">
        <span class="section-label">Leadership</span>
        <h2>Meet Our Team</h2>
        <p>The passionate people behind DoMyHomework.com</p>
      </div>

      <div class="team-grid">
        <div class="team-card" *ngFor="let member of teamMembers">
          <div class="member-avatar">
            <span>{{ member.initials }}</span>
          </div>
          <h3>{{ member.name }}</h3>
          <span class="member-role">{{ member.role }}</span>
          <p>{{ member.bio }}</p>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-section">
      <div class="why-content">
        <div class="why-text">
          <span class="section-label">Why Choose Us</span>
          <h2>More Than Just a Writing Service</h2>
          <p>
            We're committed to being your academic partner, not just a service provider.
            Here's what sets us apart:
          </p>
          <ul class="why-list">
            <li>
              <span class="check-icon">&#10003;</span>
              <div>
                <strong>Learning-Focused Approach</strong>
                <span>We provide detailed explanations so you learn from every paper</span>
              </div>
            </li>
            <li>
              <span class="check-icon">&#10003;</span>
              <div>
                <strong>Expert Matching</strong>
                <span>AI-powered matching ensures the perfect writer for your subject</span>
              </div>
            </li>
            <li>
              <span class="check-icon">&#10003;</span>
              <div>
                <strong>Complete Transparency</strong>
                <span>Track your order progress and communicate directly with writers</span>
              </div>
            </li>
            <li>
              <span class="check-icon">&#10003;</span>
              <div>
                <strong>Student-Friendly Pricing</strong>
                <span>Competitive rates with no hidden fees and flexible payment options</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="why-stats">
          <div class="highlight-card">
            <div class="highlight-number">4.9/5</div>
            <div class="highlight-label">Average Student Rating</div>
            <div class="highlight-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <p>Based on 10,000+ verified reviews</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Commitment Section -->
    <section class="commitment-section">
      <div class="section-header">
        <span class="section-label">Our Promise</span>
        <h2>Our Commitment to You</h2>
      </div>

      <div class="commitment-grid">
        <div class="commitment-card">
          <div class="commitment-icon">&#128274;</div>
          <h3>Privacy First</h3>
          <p>Your personal information is protected with bank-level encryption. We never share your data with third parties.</p>
        </div>
        <div class="commitment-card">
          <div class="commitment-icon">&#9989;</div>
          <h3>Quality Assurance</h3>
          <p>Every paper undergoes rigorous quality checks and plagiarism screening before delivery.</p>
        </div>
        <div class="commitment-card">
          <div class="commitment-icon">&#128176;</div>
          <h3>Fair Policies</h3>
          <p>60-day money-back guarantee, free revisions, and transparent pricing with no surprises.</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to Start Your Academic Journey?</h2>
        <p>Join over 50,000 students who trust us with their academic success</p>
        <div class="cta-buttons">
          <a routerLink="/submit-paper" class="btn-cta-primary">Get Started Today</a>
          <a routerLink="/features" class="btn-cta-secondary">Explore Features</a>
        </div>
        <div class="cta-contact">
          <p>Have questions? We're here to help.</p>
          <div class="contact-options">
            <span class="contact-item">
              <span class="contact-icon">&#128231;</span>
              support&#64;domyhomework.com
            </span>
            <span class="contact-item">
              <span class="contact-icon">&#128222;</span>
              24/7 Live Chat
            </span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 5rem 2rem 8rem;
      position: relative;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
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
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      opacity: 0.95;
      line-height: 1.7;
      max-width: 650px;
      margin: 0 auto;
    }

    .hero-wave {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      line-height: 0;
    }

    .hero-wave svg {
      width: 100%;
      height: auto;
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

    .section-header.light {
      color: white;
    }

    .section-header.light .section-label {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 1rem;
    }

    .section-header.light h2 {
      color: white;
    }

    .section-header p {
      font-size: 1.1rem;
      color: #666;
      max-width: 600px;
      margin: 0 auto;
    }

    .section-header.light p {
      color: rgba(255, 255, 255, 0.9);
    }

    /* Story Section */
    .story-section {
      padding: 5rem 2rem;
      background: #f8f9fa;
    }

    .story-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .story-text h2 {
      font-size: 2.25rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 1.5rem;
    }

    .story-text p {
      color: #555;
      font-size: 1.05rem;
      line-height: 1.8;
      margin-bottom: 1.25rem;
    }

    .story-image {
      display: flex;
      justify-content: center;
    }

    .image-placeholder {
      width: 100%;
      max-width: 400px;
      aspect-ratio: 1;
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20px 60px rgba(208, 74, 2, 0.3);
    }

    .placeholder-content {
      text-align: center;
      color: white;
    }

    .placeholder-icon {
      font-size: 5rem;
      display: block;
      margin-bottom: 1rem;
    }

    .placeholder-text {
      font-size: 1.25rem;
      font-weight: 600;
    }

    /* Stats Section */
    .stats-section {
      padding: 4rem 2rem;
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
    }

    .stats-grid {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    .stat-item {
      text-align: center;
      color: white;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 1rem;
      opacity: 0.9;
    }

    /* Values Section */
    .values-section {
      padding: 5rem 2rem;
      background: white;
    }

    .values-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .value-card {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .value-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }

    .value-icon {
      font-size: 3rem;
      margin-bottom: 1.25rem;
    }

    .value-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 0.75rem;
    }

    .value-card p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    /* Timeline Section */
    .timeline-section {
      padding: 5rem 2rem;
      background: linear-gradient(135deg, #31393F 0%, #3A434A 100%);
    }

    .timeline {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 2px;
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(-50%);
    }

    .timeline-item {
      display: flex;
      justify-content: flex-start;
      padding: 1rem 0;
      position: relative;
    }

    .timeline-item.right {
      justify-content: flex-end;
    }

    .timeline-content {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      padding: 1.5rem;
      border-radius: 12px;
      width: 45%;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .timeline-year {
      display: inline-block;
      background: #D04A02;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .timeline-content h3 {
      color: white;
      font-size: 1.15rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .timeline-content p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0;
    }

    /* Team Section */
    .team-section {
      padding: 5rem 2rem;
      background: #f8f9fa;
    }

    .team-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .team-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
    }

    .team-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    }

    .member-avatar {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
    }

    .member-avatar span {
      color: white;
      font-size: 2rem;
      font-weight: 700;
    }

    .team-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 0.25rem;
    }

    .member-role {
      color: #D04A02;
      font-size: 0.95rem;
      font-weight: 500;
      display: block;
      margin-bottom: 1rem;
    }

    .team-card p {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0;
    }

    /* Why Section */
    .why-section {
      padding: 5rem 2rem;
      background: white;
    }

    .why-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .why-text h2 {
      font-size: 2.25rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 1rem;
    }

    .why-text > p {
      color: #666;
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .why-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .why-list li {
      display: flex;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }

    .why-list li:last-child {
      border-bottom: none;
    }

    .check-icon {
      color: #4CAF50;
      font-size: 1.25rem;
      font-weight: bold;
      flex-shrink: 0;
    }

    .why-list strong {
      display: block;
      color: #1a1a1a;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .why-list span {
      color: #666;
      font-size: 0.95rem;
    }

    .highlight-card {
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      padding: 3rem;
      border-radius: 24px;
      text-align: center;
      color: white;
      box-shadow: 0 20px 60px rgba(208, 74, 2, 0.3);
    }

    .highlight-number {
      font-size: 4rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .highlight-label {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .highlight-stars {
      font-size: 1.5rem;
      color: #FFD700;
      margin-bottom: 1rem;
    }

    .highlight-card p {
      opacity: 0.9;
      font-size: 0.95rem;
      margin: 0;
    }

    /* Commitment Section */
    .commitment-section {
      padding: 5rem 2rem;
      background: #f8f9fa;
    }

    .commitment-grid {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .commitment-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .commitment-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .commitment-card h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 0.75rem;
    }

    .commitment-card p {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.6;
      margin: 0;
    }

    /* CTA Section */
    .cta-section {
      padding: 5rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      text-align: center;
    }

    .cta-content {
      max-width: 700px;
      margin: 0 auto;
    }

    .cta-content h2 {
      color: white;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-content > p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 3rem;
    }

    .btn-cta-primary {
      background: white;
      color: #667eea;
      padding: 1rem 2.5rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.1rem;
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
      padding: 1rem 2.5rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.1rem;
      text-decoration: none;
      border: 2px solid rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
    }

    .btn-cta-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: white;
    }

    .cta-contact {
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      padding-top: 2rem;
    }

    .cta-contact > p {
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 1rem;
    }

    .contact-options {
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      font-size: 0.95rem;
    }

    .contact-icon {
      font-size: 1.1rem;
    }

    /* Responsive Styles */
    @media (max-width: 1024px) {
      .story-content,
      .why-content {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .story-image {
        order: -1;
      }

      .image-placeholder {
        max-width: 300px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .timeline::before {
        left: 30px;
      }

      .timeline-item,
      .timeline-item.right {
        justify-content: flex-start;
        padding-left: 60px;
      }

      .timeline-content {
        width: 100%;
      }

      .commitment-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 3rem 1.5rem 6rem;
      }

      .hero-section h1 {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .section-header h2 {
        font-size: 1.75rem;
      }

      .story-section,
      .values-section,
      .timeline-section,
      .team-section,
      .why-section,
      .commitment-section,
      .cta-section {
        padding: 3rem 1.5rem;
      }

      .stats-section {
        padding: 3rem 1.5rem;
      }

      .stat-number {
        font-size: 2rem;
      }

      .why-text h2,
      .story-text h2 {
        font-size: 1.75rem;
      }

      .highlight-number {
        font-size: 3rem;
      }

      .cta-content h2 {
        font-size: 1.75rem;
      }

      .contact-options {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }

      .cta-buttons {
        flex-direction: column;
      }

      .btn-cta-primary,
      .btn-cta-secondary {
        width: 100%;
      }

      .timeline-item,
      .timeline-item.right {
        padding-left: 50px;
      }

      .timeline::before {
        left: 20px;
      }
    }
  `]
})
export class AboutComponent {
  stats = [
    { value: '50,000+', label: 'Students Helped' },
    { value: '500+', label: 'Expert Writers' },
    { value: '50+', label: 'Subjects Covered' },
    { value: '98%', label: 'Satisfaction Rate' }
  ];

  values: Value[] = [
    {
      icon: '&#127919;',
      title: 'Excellence',
      description: 'We maintain the highest standards in every piece of work, ensuring quality that exceeds expectations.'
    },
    {
      icon: '&#129309;',
      title: 'Integrity',
      description: 'Honesty and transparency guide our relationships with students, writers, and partners.'
    },
    {
      icon: '&#128161;',
      title: 'Innovation',
      description: 'We continuously improve our platform and processes to deliver better academic support.'
    },
    {
      icon: '&#10084;',
      title: 'Student-First',
      description: 'Every decision we make is guided by what\'s best for our students\' success and growth.'
    },
    {
      icon: '&#128101;',
      title: 'Community',
      description: 'We foster a supportive community where students and experts collaborate effectively.'
    },
    {
      icon: '&#127793;',
      title: 'Growth',
      description: 'We believe in helping students learn and develop their skills, not just complete assignments.'
    }
  ];

  milestones: Milestone[] = [
    {
      year: '2018',
      title: 'Founded',
      description: 'Started with a small team of graduate students offering tutoring services.'
    },
    {
      year: '2019',
      title: 'Platform Launch',
      description: 'Launched our online platform, expanding from tutoring to comprehensive writing services.'
    },
    {
      year: '2020',
      title: '10,000 Students',
      description: 'Reached our first major milestone of helping 10,000 students succeed academically.'
    },
    {
      year: '2022',
      title: 'AI Integration',
      description: 'Introduced AI-powered tools for better writer matching and quality assurance.'
    },
    {
      year: '2024',
      title: '50,000+ Community',
      description: 'Grew to a community of over 50,000 students and 500+ expert writers worldwide.'
    }
  ];

  teamMembers: TeamMember[] = [
    {
      initials: 'JM',
      name: 'Dr. James Mitchell',
      role: 'Founder & CEO',
      bio: 'Former professor with 15+ years in higher education. Passionate about making academic support accessible to all students.'
    },
    {
      initials: 'SC',
      name: 'Sarah Chen',
      role: 'Head of Quality',
      bio: 'PhD in English Literature from Stanford. Leads our quality assurance team ensuring every paper meets the highest standards.'
    },
    {
      initials: 'MR',
      name: 'Michael Rodriguez',
      role: 'CTO',
      bio: 'Tech veteran with experience at Google and Microsoft. Building innovative tools to enhance the student experience.'
    },
    {
      initials: 'EW',
      name: 'Emily Watson',
      role: 'Head of Student Success',
      bio: 'Former academic advisor dedicated to ensuring every student achieves their academic goals with our support.'
    }
  ];
}
