import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Feature {
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">&#9733;</span>
          <span>Trusted by 50,000+ Students</span>
        </div>
        <h1>Powerful Features for Academic Success</h1>
        <p class="hero-subtitle">
          From essay writing to complex research papers, our expert team and AI-powered tools
          deliver exceptional academic support tailored to your needs.
        </p>
        <div class="hero-cta">
          <a routerLink="/submit-paper" class="btn-primary">Get Started Free</a>
          <a routerLink="/pricing" class="btn-secondary">View Pricing</a>
        </div>
      </div>
      <div class="hero-decoration">
        <div class="floating-card card-1">
          <span class="card-icon">&#128221;</span>
          <span>Essay Complete</span>
        </div>
        <div class="floating-card card-2">
          <span class="card-icon">&#9989;</span>
          <span>100% Original</span>
        </div>
        <div class="floating-card card-3">
          <span class="card-icon">&#128337;</span>
          <span>On-Time Delivery</span>
        </div>
      </div>
    </section>

    <!-- Main Features Grid -->
    <section class="features-section">
      <div class="section-header">
        <span class="section-label">Our Services</span>
        <h2>Everything You Need to Excel</h2>
        <p>Comprehensive academic support designed for students at every level</p>
      </div>

      <div class="features-grid">
        <div class="feature-card" *ngFor="let feature of mainFeatures" [class.highlight]="feature.highlight">
          <div class="feature-icon" [innerHTML]="feature.icon"></div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <div class="feature-badge" *ngIf="feature.highlight">Popular</div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="process-section">
      <div class="section-header">
        <span class="section-label">How It Works</span>
        <h2>Simple 4-Step Process</h2>
        <p>Get professional academic help in minutes, not hours</p>
      </div>

      <div class="process-timeline">
        <div class="process-step" *ngFor="let step of processSteps; let i = index">
          <div class="step-number">{{ step.number }}</div>
          <div class="step-content">
            <div class="step-icon" [innerHTML]="step.icon"></div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
          <div class="step-connector" *ngIf="i < processSteps.length - 1"></div>
        </div>
      </div>
    </section>

    <!-- Quality Guarantees Section -->
    <section class="guarantees-section">
      <div class="section-header light">
        <span class="section-label">Our Promise</span>
        <h2>Quality Guarantees</h2>
        <p>We stand behind every piece of work we deliver</p>
      </div>

      <div class="guarantees-grid">
        <div class="guarantee-card" *ngFor="let guarantee of guarantees">
          <div class="guarantee-icon" [innerHTML]="guarantee.icon"></div>
          <h3>{{ guarantee.title }}</h3>
          <p>{{ guarantee.description }}</p>
        </div>
      </div>
    </section>

    <!-- Expert Writers Section -->
    <section class="experts-section">
      <div class="experts-content">
        <div class="experts-text">
          <span class="section-label">Our Team</span>
          <h2>Expert Writers & Researchers</h2>
          <p>
            Our carefully vetted team of academic professionals includes PhD holders,
            published researchers, and subject matter experts from top universities worldwide.
          </p>
          <ul class="expert-list">
            <li>
              <span class="check-icon">&#10003;</span>
              <span>Advanced degrees in 50+ subjects</span>
            </li>
            <li>
              <span class="check-icon">&#10003;</span>
              <span>Rigorous quality assessment</span>
            </li>
            <li>
              <span class="check-icon">&#10003;</span>
              <span>Native English speakers</span>
            </li>
            <li>
              <span class="check-icon">&#10003;</span>
              <span>Average 5+ years experience</span>
            </li>
          </ul>
          <a routerLink="/submit-paper" class="btn-primary">Work With Our Experts</a>
        </div>
        <div class="experts-stats">
          <div class="stat-card">
            <div class="stat-number">500+</div>
            <div class="stat-label">Expert Writers</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">50+</div>
            <div class="stat-label">Subject Areas</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">98%</div>
            <div class="stat-label">Success Rate</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">4.9/5</div>
            <div class="stat-label">Average Rating</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Academic Levels Section -->
    <section class="levels-section">
      <div class="section-header">
        <span class="section-label">All Levels</span>
        <h2>Support for Every Academic Journey</h2>
        <p>From high school essays to doctoral dissertations</p>
      </div>

      <div class="levels-grid">
        <div class="level-card" *ngFor="let level of academicLevels">
          <div class="level-header">
            <div class="level-icon" [innerHTML]="level.icon"></div>
            <h3>{{ level.title }}</h3>
          </div>
          <p>{{ level.description }}</p>
          <ul class="level-services">
            <li *ngFor="let service of level.services">
              <span class="check-icon">&#10003;</span>
              {{ service }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Subjects Section -->
    <section class="subjects-section">
      <div class="section-header light">
        <span class="section-label">Subjects</span>
        <h2>We Cover Every Subject</h2>
        <p>Expert help across all academic disciplines</p>
      </div>

      <div class="subjects-grid">
        <div class="subject-tag" *ngFor="let subject of subjects">
          {{ subject }}
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to Achieve Academic Excellence?</h2>
        <p>Join thousands of students who trust us with their academic success</p>
        <div class="cta-buttons">
          <a routerLink="/submit-paper" class="btn-cta-primary">Submit Your Paper</a>
          <a routerLink="/pricing" class="btn-cta-secondary">Calculate Price</a>
        </div>
        <div class="cta-trust">
          <span class="trust-item">
            <span class="trust-icon">&#128274;</span>
            Secure & Confidential
          </span>
          <span class="trust-item">
            <span class="trust-icon">&#128176;</span>
            Money-Back Guarantee
          </span>
          <span class="trust-item">
            <span class="trust-icon">&#9201;</span>
            24/7 Support
          </span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero-section {
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      color: white;
      padding: 5rem 2rem;
      position: relative;
      overflow: hidden;
      min-height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .hero-content {
      max-width: 700px;
      text-align: center;
      z-index: 2;
      position: relative;
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
      color: #FFD700;
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
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary {
      background: white;
      color: #D04A02;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .btn-secondary {
      background: transparent;
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      border: 2px solid rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: white;
    }

    .hero-decoration {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    .floating-card {
      position: absolute;
      background: rgba(255, 255, 255, 0.95);
      color: #333;
      padding: 0.75rem 1.25rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      animation: float 3s ease-in-out infinite;
    }

    .card-1 {
      top: 15%;
      left: 5%;
      animation-delay: 0s;
    }

    .card-2 {
      top: 25%;
      right: 8%;
      animation-delay: 1s;
    }

    .card-3 {
      bottom: 20%;
      left: 10%;
      animation-delay: 2s;
    }

    .card-icon {
      font-size: 1.2rem;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    /* Section Styles */
    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-header.light {
      color: white;
    }

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

    /* Features Section */
    .features-section {
      padding: 5rem 2rem;
      background: #f8f9fa;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }

    .feature-card.highlight {
      border: 2px solid #D04A02;
    }

    .feature-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: #D04A02;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1.25rem;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 0.75rem;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    /* Process Section */
    .process-section {
      padding: 5rem 2rem;
      background: white;
    }

    .process-timeline {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .process-step {
      flex: 1;
      min-width: 220px;
      max-width: 280px;
      text-align: center;
      position: relative;
    }

    .step-number {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0 auto 1.5rem;
    }

    .step-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .step-content h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 0.5rem;
    }

    .step-content p {
      color: #666;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .step-connector {
      display: none;
    }

    /* Guarantees Section */
    .guarantees-section {
      padding: 5rem 2rem;
      background: linear-gradient(135deg, #31393F 0%, #3A434A 100%);
    }

    .guarantees-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .guarantee-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }

    .guarantee-card:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-3px);
    }

    .guarantee-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .guarantee-card h3 {
      color: white;
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .guarantee-card p {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0;
    }

    /* Experts Section */
    .experts-section {
      padding: 5rem 2rem;
      background: #f8f9fa;
    }

    .experts-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .experts-text h2 {
      font-size: 2.25rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 1rem;
    }

    .experts-text > p {
      color: #666;
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }

    .expert-list {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem 0;
    }

    .expert-list li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
      color: #444;
      font-size: 1rem;
    }

    .check-icon {
      color: #4CAF50;
      font-weight: bold;
      font-size: 1.1rem;
    }

    .experts-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 700;
      color: #D04A02;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.95rem;
    }

    /* Academic Levels Section */
    .levels-section {
      padding: 5rem 2rem;
      background: white;
    }

    .levels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .level-card {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 16px;
      transition: all 0.3s ease;
    }

    .level-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    }

    .level-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .level-icon {
      font-size: 2rem;
    }

    .level-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }

    .level-card > p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .level-services {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .level-services li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0;
      color: #444;
      font-size: 0.95rem;
    }

    /* Subjects Section */
    .subjects-section {
      padding: 5rem 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .subjects-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .subject-tag {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 0.95rem;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .subject-tag:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
    }

    /* CTA Section */
    .cta-section {
      padding: 5rem 2rem;
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
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
      margin-bottom: 2rem;
    }

    .btn-cta-primary {
      background: white;
      color: #D04A02;
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

    .cta-trust {
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.95rem;
    }

    .trust-icon {
      font-size: 1.1rem;
    }

    /* Responsive Styles */
    @media (max-width: 1024px) {
      .experts-content {
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .hero-section h1 {
        font-size: 2.5rem;
      }

      .floating-card {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 3rem 1.5rem;
        min-height: auto;
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

      .features-section,
      .process-section,
      .guarantees-section,
      .experts-section,
      .levels-section,
      .subjects-section,
      .cta-section {
        padding: 3rem 1.5rem;
      }

      .experts-stats {
        grid-template-columns: repeat(2, 1fr);
      }

      .cta-content h2 {
        font-size: 1.75rem;
      }

      .cta-trust {
        gap: 1rem;
      }

      .trust-item {
        font-size: 0.85rem;
      }
    }

    @media (max-width: 480px) {
      .hero-cta {
        flex-direction: column;
      }

      .btn-primary,
      .btn-secondary {
        width: 100%;
        justify-content: center;
      }

      .experts-stats {
        grid-template-columns: 1fr;
      }

      .cta-buttons {
        flex-direction: column;
      }

      .btn-cta-primary,
      .btn-cta-secondary {
        width: 100%;
      }
    }
  `]
})
export class FeaturesComponent {
  mainFeatures: Feature[] = [
    {
      icon: '&#128221;',
      title: 'Custom Essay Writing',
      description: 'Professionally crafted essays tailored to your exact requirements, from high school to PhD level.',
      highlight: true
    },
    {
      icon: '&#128218;',
      title: 'Research Papers',
      description: 'In-depth research with proper citations, comprehensive analysis, and original insights.'
    },
    {
      icon: '&#128203;',
      title: 'Thesis & Dissertations',
      description: 'Complete support for your major academic projects with expert guidance at every step.'
    },
    {
      icon: '&#9997;',
      title: 'Editing & Proofreading',
      description: 'Polish your work with professional editing for grammar, style, and academic tone.'
    },
    {
      icon: '&#128202;',
      title: 'Case Studies',
      description: 'Detailed analysis and professional case study reports for business and academic needs.'
    },
    {
      icon: '&#128209;',
      title: 'Lab Reports',
      description: 'Accurate scientific documentation following proper methodology and formatting.'
    },
    {
      icon: '&#127891;',
      title: 'Coursework Help',
      description: 'Assignment assistance across all subjects to help you meet your academic goals.'
    },
    {
      icon: '&#128240;',
      title: 'Presentations',
      description: 'Engaging slide decks and presentation materials that make your ideas shine.'
    }
  ];

  processSteps: ProcessStep[] = [
    {
      number: 1,
      title: 'Place Your Order',
      description: 'Fill out our simple form with your requirements and deadline.',
      icon: '&#128196;'
    },
    {
      number: 2,
      title: 'Get Matched',
      description: 'We assign the best expert writer for your specific subject.',
      icon: '&#129309;'
    },
    {
      number: 3,
      title: 'Track Progress',
      description: 'Stay updated and communicate directly with your writer.',
      icon: '&#128269;'
    },
    {
      number: 4,
      title: 'Receive & Review',
      description: 'Get your completed work and request free revisions if needed.',
      icon: '&#9989;'
    }
  ];

  guarantees: Feature[] = [
    {
      icon: '&#128274;',
      title: '100% Plagiarism-Free',
      description: 'Every paper is written from scratch and checked with advanced plagiarism detection tools.'
    },
    {
      icon: '&#128176;',
      title: 'Money-Back Guarantee',
      description: 'Not satisfied? Get a full refund within 60 days, no questions asked.'
    },
    {
      icon: '&#9201;',
      title: 'On-Time Delivery',
      description: 'We guarantee your work will be delivered before the deadline, every time.'
    },
    {
      icon: '&#128272;',
      title: 'Complete Confidentiality',
      description: 'Your personal information and orders are protected with bank-level encryption.'
    },
    {
      icon: '&#128260;',
      title: 'Free Revisions',
      description: 'Unlimited revisions for 10 days after delivery to ensure complete satisfaction.'
    },
    {
      icon: '&#128222;',
      title: '24/7 Support',
      description: 'Our friendly support team is available around the clock to assist you.'
    }
  ];

  academicLevels = [
    {
      icon: '&#127979;',
      title: 'High School',
      description: 'Strong foundational support for high school students tackling essays and projects.',
      services: ['Essays & Reports', 'Book Reviews', 'Research Projects', 'Presentation Help']
    },
    {
      icon: '&#127891;',
      title: 'Undergraduate',
      description: 'Comprehensive assistance for college coursework and complex assignments.',
      services: ['Term Papers', 'Research Papers', 'Case Studies', 'Lab Reports']
    },
    {
      icon: '&#128218;',
      title: 'Masters',
      description: 'Advanced academic support for graduate-level research and writing.',
      services: ['Thesis Support', 'Literature Reviews', 'Data Analysis', 'Academic Articles']
    },
    {
      icon: '&#127942;',
      title: 'PhD / Doctoral',
      description: 'Expert guidance for doctoral candidates on dissertations and publications.',
      services: ['Dissertation Chapters', 'Research Proposals', 'Journal Articles', 'Peer Review Prep']
    }
  ];

  subjects: string[] = [
    'Business & Management',
    'Computer Science',
    'Economics',
    'Engineering',
    'English Literature',
    'Healthcare & Nursing',
    'History',
    'Law',
    'Marketing',
    'Mathematics',
    'Philosophy',
    'Psychology',
    'Sociology',
    'Biology',
    'Chemistry',
    'Physics',
    'Political Science',
    'Education',
    'Art & Design',
    'Communications'
  ];
}
