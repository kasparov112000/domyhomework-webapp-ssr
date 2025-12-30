import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="container">
        <span class="hero-icon material-icons">school</span>
        <h1>Expert Academic Assistance & Study Resources</h1>
        <p class="lead">Get professional help with editing, proofreading, problem solving, and research. High-quality model papers and study guides to help you succeed.</p>
        <div class="cta-buttons">
          <a routerLink="/order" class="btn btn-primary">Get Started Now</a>
          <a routerLink="/pricing" class="btn btn-secondary">View Pricing</a>
        </div>
        <div class="hero-badges">
          <span class="hero-badge"><span class="material-icons">verified</span> Expert Writers</span>
          <span class="hero-badge"><span class="material-icons">schedule</span> On-Time Delivery</span>
          <span class="hero-badge"><span class="material-icons">thumb_up</span> 60-Day Guarantee</span>
        </div>
      </div>
    </section>

    <section class="services-section">
      <div class="container">
        <h2>Our Academic Services</h2>
        <p class="section-subtitle">Professional assistance tailored to your academic level and needs</p>
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon-wrapper">
              <span class="service-icon material-icons">edit_note</span>
            </div>
            <h3>Editing & Proofreading</h3>
            <p>Perfect your papers with expert editing. We fix grammar, spelling, punctuation, and improve clarity and flow.</p>
            <ul class="service-features">
              <li>Grammar & spelling correction</li>
              <li>Punctuation & style improvement</li>
              <li>Clarity & readability enhancement</li>
              <li>Formatting & citation check</li>
            </ul>
            <div class="service-price">From <strong>$7/page</strong></div>
          </div>
          <div class="service-card featured">
            <div class="featured-badge">Most Popular</div>
            <div class="service-icon-wrapper">
              <span class="service-icon material-icons">calculate</span>
            </div>
            <h3>Problem Solving (STEM)</h3>
            <p>Step-by-step solutions for math, physics, chemistry, statistics, and other technical subjects.</p>
            <ul class="service-features">
              <li>Detailed step-by-step solutions</li>
              <li>Clear explanations included</li>
              <li>All STEM subjects covered</li>
              <li>Learn the methodology</li>
            </ul>
            <div class="service-price">From <strong>$5/problem</strong></div>
          </div>
          <div class="service-card">
            <div class="service-icon-wrapper">
              <span class="service-icon material-icons">description</span>
            </div>
            <h3>Research & Model Papers</h3>
            <p>Original research assistance and sample papers to guide your own writing and understanding.</p>
            <ul class="service-features">
              <li>Original, plagiarism-free content</li>
              <li>Proper citations & formatting</li>
              <li>Any academic level</li>
              <li>All subjects available</li>
            </ul>
            <div class="service-price">From <strong>$12/page</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section class="how-it-works">
      <div class="container">
        <h2>How It Works</h2>
        <p class="section-subtitle">Get your academic assistance in 3 simple steps</p>
        <div class="steps-grid">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Submit Your Request</h3>
            <p>Tell us about your assignment, deadline, and academic level. Upload any relevant materials or instructions.</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Expert Works On It</h3>
            <p>A qualified expert in your subject area works on your request, following all your specifications.</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Receive & Review</h3>
            <p>Download your completed work, review it, and request free revisions if needed.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="why-choose-us">
      <div class="container">
        <h2>Why Students Choose Us</h2>
        <div class="benefits-grid">
          <div class="benefit-item">
            <span class="benefit-icon material-icons">psychology</span>
            <h4>Subject Experts</h4>
            <p>Our team includes experts across all academic disciplines and levels.</p>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon material-icons">access_time</span>
            <h4>Fast Turnaround</h4>
            <p>Need it urgently? We offer expedited delivery for tight deadlines.</p>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon material-icons">security</span>
            <h4>100% Confidential</h4>
            <p>Your information and orders are kept completely private and secure.</p>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon material-icons">autorenew</span>
            <h4>Free Revisions</h4>
            <p>Not satisfied? Request free revisions until it meets your expectations.</p>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon material-icons">verified_user</span>
            <h4>Money-Back Guarantee</h4>
            <p>60-day money-back guarantee if you're not completely satisfied.</p>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon material-icons">support_agent</span>
            <h4>24/7 Support</h4>
            <p>Our support team is available around the clock to help you.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <div class="container">
        <h2>What Students Say</h2>
        <div class="testimonial-grid">
          <div class="testimonial">
            <div class="stars">★★★★★</div>
            <p>"The editing service transformed my essay. My professor commented on how well-written it was!"</p>
            <cite>- Sarah M., Business Student</cite>
          </div>
          <div class="testimonial">
            <div class="stars">★★★★★</div>
            <p>"Finally understood calculus after seeing their step-by-step solutions. It's like having a tutor available 24/7."</p>
            <cite>- Michael R., Engineering Major</cite>
          </div>
          <div class="testimonial">
            <div class="stars">★★★★★</div>
            <p>"The research paper sample helped me understand proper structure and citations. Improved my own writing significantly."</p>
            <cite>- Emily T., Psychology Student</cite>
          </div>
        </div>
      </div>
    </section>

    <section class="academic-levels">
      <div class="container">
        <h2>All Academic Levels Welcome</h2>
        <div class="levels-grid">
          <div class="level-card">
            <span class="level-icon material-icons">menu_book</span>
            <h4>High School</h4>
            <p>Essays, homework help, and test prep</p>
          </div>
          <div class="level-card">
            <span class="level-icon material-icons">school</span>
            <h4>Undergraduate</h4>
            <p>Research papers, problem sets, and projects</p>
          </div>
          <div class="level-card">
            <span class="level-icon material-icons">workspace_premium</span>
            <h4>Master's</h4>
            <p>Advanced research and technical writing</p>
          </div>
          <div class="level-card">
            <span class="level-icon material-icons">military_tech</span>
            <h4>PhD</h4>
            <p>Dissertation support and scholarly work</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2>Ready to Succeed Academically?</h2>
        <p>Join thousands of students who've improved their grades with our expert assistance.</p>
        <div class="cta-buttons">
          <a routerLink="/order" class="btn btn-primary btn-large">Place Your Order</a>
          <a routerLink="/contact" class="btn btn-outline">Have Questions? Contact Us</a>
        </div>
        <p class="cta-note">* All materials provided as study aids and reference guides for research purposes only.</p>
      </div>
    </section>
  `,
  styles: [`
    /* Container */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      color: white;
      padding: 5rem 0;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('/assets/images/pattern-overlay.png');
      opacity: 0.1;
    }

    .hero-icon {
      font-size: 64px;
      color: white;
      display: inline-block;
      margin-bottom: 1rem;
      font-family: 'Material Icons';
      position: relative;
      z-index: 1;
      opacity: 0.95;
    }

    h1 {
      font-size: 2.75rem;
      margin-bottom: 1.25rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 1;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    .lead {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.95;
      max-width: 650px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      z-index: 1;
      line-height: 1.6;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
      margin-bottom: 2rem;
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
      background: white;
      color: #D04A02;
      border: 2px solid white;
    }

    .btn-primary:hover {
      background: transparent;
      color: white;
    }

    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid rgba(255,255,255,0.8);
    }

    .btn-secondary:hover {
      background: white;
      color: #D04A02;
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

    .hero-badges {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
    }

    .hero-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .hero-badge .material-icons {
      font-size: 18px;
    }

    /* Section Common Styles */
    .section-subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 3rem;
      font-size: 1.1rem;
    }

    /* Services Section */
    .services-section {
      padding: 5rem 0;
      background: #fafafa;
    }

    .services-section h2 {
      text-align: center;
      font-size: 2.25rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .service-card {
      background: white;
      padding: 2.5rem 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      position: relative;
      border: 2px solid transparent;
    }

    .service-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.12);
    }

    .service-card.featured {
      border-color: #D04A02;
      background: linear-gradient(to bottom, #fff8f5, white);
    }

    .featured-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: #D04A02;
      color: white;
      padding: 0.35rem 1rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .service-icon-wrapper {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .service-icon {
      font-size: 36px;
      color: white;
      font-family: 'Material Icons';
    }

    .service-card h3 {
      color: #333;
      font-size: 1.4rem;
      margin-bottom: 1rem;
    }

    .service-card > p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .service-features {
      list-style: none;
      padding: 0;
      margin: 0 0 1.5rem;
      text-align: left;
    }

    .service-features li {
      padding: 0.4rem 0 0.4rem 1.5rem;
      position: relative;
      color: #555;
      font-size: 0.9rem;
    }

    .service-features li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #4CAF50;
      font-weight: bold;
    }

    .service-price {
      color: #333;
      font-size: 1.1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .service-price strong {
      color: #D04A02;
      font-size: 1.3rem;
    }

    /* How It Works */
    .how-it-works {
      padding: 5rem 0;
      background: white;
    }

    .how-it-works h2 {
      text-align: center;
      margin-bottom: 0.5rem;
      font-size: 2.25rem;
      color: #333;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .step {
      text-align: center;
      padding: 1.5rem;
    }

    .step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: #D04A02;
      color: white;
      border-radius: 50%;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1.25rem;
      box-shadow: 0 4px 12px rgba(208, 74, 2, 0.3);
    }

    .step h3 {
      color: #333;
      font-size: 1.2rem;
      margin-bottom: 0.75rem;
    }

    .step p {
      color: #666;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    /* Why Choose Us */
    .why-choose-us {
      padding: 5rem 0;
      background: #fafafa;
    }

    .why-choose-us h2 {
      text-align: center;
      font-size: 2.25rem;
      color: #333;
      margin-bottom: 3rem;
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.25rem;
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .benefit-icon {
      font-size: 28px;
      color: #D04A02;
      font-family: 'Material Icons';
      flex-shrink: 0;
    }

    .benefit-item h4 {
      color: #333;
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
    }

    .benefit-item p {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }

    /* Testimonials */
    .testimonials {
      background: #31393f;
      padding: 5rem 0;
      color: white;
    }

    .testimonials h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2.25rem;
      color: white;
    }

    .testimonial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .testimonial {
      background: rgba(255, 255, 255, 0.05);
      padding: 2rem;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: background-color 0.3s ease;
    }

    .testimonial:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .stars {
      color: #FFD700;
      font-size: 1.1rem;
      margin-bottom: 1rem;
      letter-spacing: 2px;
    }

    .testimonial p {
      font-style: italic;
      margin-bottom: 1rem;
      color: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      line-height: 1.6;
    }

    .testimonial cite {
      color: #D04A02;
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Academic Levels */
    .academic-levels {
      padding: 5rem 0;
      background: white;
    }

    .academic-levels h2 {
      text-align: center;
      font-size: 2.25rem;
      color: #333;
      margin-bottom: 3rem;
    }

    .levels-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .level-card {
      text-align: center;
      padding: 2rem 1rem;
      background: #fafafa;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .level-card:hover {
      background: #fff;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }

    .level-icon {
      font-size: 40px;
      color: #D04A02;
      font-family: 'Material Icons';
      margin-bottom: 1rem;
    }

    .level-card h4 {
      color: #333;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .level-card p {
      color: #666;
      font-size: 0.85rem;
      margin: 0;
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, #31393f 0%, #1a1f24 100%);
      padding: 5rem 0;
      text-align: center;
      color: white;
    }

    .cta-section h2 {
      font-size: 2.25rem;
      color: white;
      margin-bottom: 1rem;
    }

    .cta-section > .container > p {
      color: rgba(255,255,255,0.9);
      font-size: 1.15rem;
      margin-bottom: 2rem;
    }

    .cta-section .cta-buttons {
      margin-bottom: 1.5rem;
    }

    .cta-section .btn-primary {
      background: #D04A02;
      color: white;
      border-color: #D04A02;
    }

    .cta-section .btn-primary:hover {
      background: #B03902;
      border-color: #B03902;
    }

    .btn-large {
      font-size: 1.1rem;
      padding: 1rem 2.5rem;
    }

    .cta-note {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.6);
      margin: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }

      .hero {
        padding: 3.5rem 0;
      }

      .hero-badges {
        flex-direction: column;
        gap: 0.75rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .cta-buttons .btn {
        width: 100%;
        max-width: 280px;
      }

      .steps-grid {
        grid-template-columns: 1fr;
      }

      .levels-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .services-section h2,
      .how-it-works h2,
      .why-choose-us h2,
      .testimonials h2,
      .academic-levels h2,
      .cta-section h2 {
        font-size: 1.75rem;
      }
    }

    @media (max-width: 480px) {
      .levels-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {}