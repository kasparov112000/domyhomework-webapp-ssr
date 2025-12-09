import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hero">
      <div class="container">
        <span class="hero-icon material-icons">smart_toy</span>
        <h1>Your AI-Powered Homework Assistant</h1>
        <p class="lead">DoMyHomework.ai transforms how you study with instant audio-to-text conversion, text-to-audio synthesis, and AI-powered assignment help.</p>
        <div class="cta-buttons">
          <a href="https://app.domyhomework.ai" class="btn btn-primary">Start Free Trial</a>
          <a href="/features" class="btn btn-secondary">See How It Works</a>
        </div>
      </div>
    </section>

    <section class="features-preview">
      <div class="container">
        <h2>Powerful AI Tools for Academic Success</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <span class="feature-icon material-icons">mic</span>
            <h3>Audio to Text</h3>
            <p>Convert lectures, discussions, and audio notes into searchable, editable text instantly.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon material-icons">volume_up</span>
            <h3>Text to Audio</h3>
            <p>Transform textbooks and notes into audio for learning on-the-go or auditory studying.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon material-icons">auto_awesome</span>
            <h3>AI Problem Solver</h3>
            <p>Get step-by-step solutions and explanations for math, science, and complex problems.</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon material-icons">edit_note</span>
            <h3>Smart Summaries</h3>
            <p>Generate concise summaries of lengthy texts and create study guides automatically.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="how-it-works">
      <div class="container">
        <h2>How DoMyHomework.ai Works</h2>
        <div class="steps-grid">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Upload or Record</h3>
            <p>Upload your lecture recordings, textbooks, or record audio directly in the app.</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>AI Processing</h3>
            <p>Our advanced AI instantly converts, analyzes, and enhances your content.</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Get Results</h3>
            <p>Receive transcripts, audio files, summaries, or solutions ready for studying.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <div class="container">
        <h2>Students Love DoMyHomework.ai</h2>
        <div class="testimonial-grid">
          <div class="testimonial">
            <p>"Converting my professor's lectures to text has been a game-changer for my note-taking!"</p>
            <cite>- Maria L., Engineering Student</cite>
          </div>
          <div class="testimonial">
            <p>"The text-to-audio feature lets me study while commuting. My grades have improved significantly."</p>
            <cite>- Alex K., Pre-Med Student</cite>
          </div>
          <div class="testimonial">
            <p>"The AI solver doesn't just give answers - it teaches me how to solve problems step by step."</p>
            <cite>- Jordan T., Math Major</cite>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2>Ready to Transform Your Study Experience?</h2>
        <p>Join thousands of students already using AI to study smarter, not harder.</p>
        <a href="https://app.domyhomework.ai" class="btn btn-primary btn-large">Get Started Free</a>
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

    .how-it-works {
      padding: 5rem 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
    }

    .how-it-works h2 {
      text-align: center;
      margin-bottom: 3rem;
      font-size: 2.5rem;
      color: #333;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .step {
      text-align: center;
      padding: 2rem;
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
      margin-bottom: 1.5rem;
      box-shadow: 0 3px 10px rgba(208, 74, 2, 0.3);
    }

    .step h3 {
      color: #333;
      font-size: 1.4rem;
      margin-bottom: 1rem;
    }

    .step p {
      color: #666;
      line-height: 1.6;
    }

    .cta-section {
      background: #fafafa;
      padding: 5rem 0;
      text-align: center;
    }

    .cta-section h2 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 1rem;
    }

    .cta-section p {
      color: #666;
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    .btn-large {
      font-size: 1.2rem;
      padding: 1rem 2.5rem;
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