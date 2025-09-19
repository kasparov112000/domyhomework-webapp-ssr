import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Contact Us</h1>
      <p>Get in touch with our team.</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 3rem 0;
    }
  `]
})
export class ContactComponent {}