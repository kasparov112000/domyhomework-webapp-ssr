import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Pricing</h1>
      <p>Choose the plan that fits your learning needs.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 3rem 0;
    }
  `]
})
export class PricingComponent {}