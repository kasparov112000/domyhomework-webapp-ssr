import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="container">
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
            <h3>Interactive Quizzes</h3>
            <p>Create and take custom quizzes tailored to your learning style and pace.</p>
          </div>
          <div class="feature-card">
            <h3>Chess Learning</h3>
            <p>Master chess openings, tactics, and strategies with our interactive chess questions.</p>
          </div>
          <div class="feature-card">
            <h3>Progress Tracking</h3>
            <p>Monitor your learning journey with detailed analytics and performance insights.</p>
          </div>
          <div class="feature-card">
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
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      padding: 6rem 0;
      text-align: center;
    }
    
    h1 {
      font-size: 3rem;
      margin-bottom: 1.5rem;
    }
    
    .lead {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    
    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    .features-preview {
      padding: 4rem 0;
    }
    
    .features-preview h2 {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .feature-card h3 {
      color: #007bff;
    }
    
    .testimonials {
      background: #f8f9fa;
      padding: 4rem 0;
    }
    
    .testimonials h2 {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .testimonial-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .testimonial {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .testimonial p {
      font-style: italic;
      margin-bottom: 1rem;
    }
    
    .testimonial cite {
      color: #6c757d;
      font-size: 0.9rem;
    }
  `]
})
export class HomeComponent {}