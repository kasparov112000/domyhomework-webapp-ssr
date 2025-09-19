import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="container">
        <span class="hero-icon material-icons">psychology</span>
        <h1>Master Any Subject Through Interactive Testing</h1>
        <p class="lead">LearnByTesting revolutionizes education by combining proven testing techniques with personalized learning paths.</p>
        <div class="cta-buttons">
          <a href="https://app.learnbytesting.ai" class="btn btn-primary">Get Started Free</a>
          <a href="/features" class="btn btn-secondary">Learn More</a>
        </div>
      </div>
    </section>

    <section class="features-preview">
      <div class="container">
        <h2>Why LearnByTesting?</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <span class="feature-icon material-icons">quiz</span>
            <h3>Interactive Quizzes</h3>
            <p>Create and take custom quizzes tailored to your learning style and pace.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon material-icons">extension</span>
            <h3>Chess Learning</h3>
            <p>Master chess openings, tactics, and strategies with our interactive chess questions.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon material-icons">analytics</span>
            <h3>Progress Tracking</h3>
            <p>Monitor your learning journey with detailed analytics and performance insights.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon material-icons">list_alt</span>
            <h3>Multiple Question Types</h3>
            <p>Choose from multiple choice, true/false, and interactive question formats.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <div class="container">
        <h2>What Learners Say</h2>
        <div class="testimonial-grid">
          <div class="testimonial">
            <p>"LearnByTesting helped me improve my chess rating by 300 points in just 2 months!"</p>
            <cite>- Sarah M., Chess Enthusiast</cite>
          </div>
          <div class="testimonial">
            <p>"The interactive testing approach made studying actually enjoyable and effective."</p>
            <cite>- John D., Medical Student</cite>
          </div>
          <div class="testimonial">
            <p>"I love how I can create custom quizzes for my students. Game changer!"</p>
            <cite>- Emily R., Teacher</cite>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #D04A02 0%, #B03902 100%);
      color: white;
      padding: 6rem 0;
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
      font-size: 80px;
      color: white;
      display: inline-block;
      margin-bottom: 1.5rem;
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
      position: relative;
      z-index: 1;
      opacity: 0.9;
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    h1 {
      font-size: 3.5rem;
      margin-bottom: 1.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 1;
    }
    
    .lead {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.95;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      z-index: 1;
    }
    
    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
    }
    
    .features-preview {
      padding: 5rem 0;
      background-color: #fafafa;
    }
    
    .features-preview h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2.5rem;
      color: #333;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      background: white;
      padding: 2.5rem 2rem;
      border-radius: 8px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.08);
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border-top: 3px solid transparent;
    }
    
    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.12);
      border-top-color: #D04A02;
    }
    
    .feature-icon {
      font-size: 48px;
      color: #D04A02;
      display: inline-block;
      margin-bottom: 1rem;
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }
    
    .feature-card h3 {
      color: #D04A02;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .feature-card p {
      color: #666;
      line-height: 1.6;
    }
    
    .testimonials {
      background: #31393f;
      padding: 5rem 0;
      color: white;
    }
    
    .testimonials h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2.5rem;
      color: white;
    }
    
    .testimonial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }
    
    .testimonial {
      background: rgba(255, 255, 255, 0.05);
      padding: 2.5rem 2rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: background-color 0.3s ease;
    }
    
    .testimonial:hover {
      background: rgba(255, 255, 255, 0.08);
    }
    
    .testimonial p {
      font-style: italic;
      margin-bottom: 1rem;
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.1rem;
      line-height: 1.6;
    }
    
    .testimonial cite {
      color: #D04A02;
      font-size: 0.95rem;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 2.5rem;
      }
      
      .hero {
        padding: 4rem 0;
      }
      
      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .cta-buttons .btn {
        width: 200px;
      }
    }
  `]
})
export class HomeComponent {}