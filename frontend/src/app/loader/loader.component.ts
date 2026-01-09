import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" *ngIf="show">
      <div class="loader-content">
        <img src="assets/loader/van.gif" alt="Loading" />
        <p>Loading...</p>
      </div>
    </div>
  `,
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  show = false;
}
