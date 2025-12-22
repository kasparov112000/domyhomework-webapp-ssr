import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>About DoMyHomework.ai</h1>
      <p>We're on a mission to transform how students study with AI-powered tools for academic success.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 3rem 0;
    }
  `]
})
export class AboutComponent {}