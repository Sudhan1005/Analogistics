import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warehouse-list.component.html'
})
export class WarehouseListComponent implements OnInit {

  warehouses: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses() {
    this.dataService.getWarehouses().subscribe({
      next: (res) => {
        console.log('Warehouses API response:', res); // ✅ DEBUG
        this.warehouses = res;
      },
      error: (err) => {
        console.error('Warehouse API error:', err);
      }
    });
  }
}
