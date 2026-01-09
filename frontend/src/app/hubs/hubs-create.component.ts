import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DataService } from '../services/data.service'; // ✅ THIS LINE WAS MISSING

@Component({
  selector: 'app-hubs-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './hubs-create.component.html'
})
export class HubsCreateComponent {

  hub = {
    name: '',
    city: '',
    status: ''
  };

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  saveHub() {
    this.dataService.createHub(this.hub).subscribe({
      next: () => {
        alert('Hub created successfully');
        this.router.navigate(['/dashboard/hubs']); // ✅ go to list
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create hub');
      }
    });
  }
}
