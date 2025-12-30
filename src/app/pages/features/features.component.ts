import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Features</h1>
      <p>Discover all the powerful AI tools that make DoMyHomework.com the best study assistant.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 3rem 0;
    }
  `]
})
export class FeaturesComponent {}