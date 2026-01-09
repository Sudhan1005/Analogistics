import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './warehouse-create.component.html'
})
export class WarehouseCreateComponent {

  warehouse = {
    name: '',
    location: '',
    capacity: null
  };

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  saveWarehouse() {
    this.dataService.createWarehouse(this.warehouse).subscribe({
      next: () => {
        alert('Warehouse created successfully');
        this.router.navigate(['/dashboard/warehouses']); // ✅ GO TO LIST
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create warehouse');
      }
    });
  }
}
