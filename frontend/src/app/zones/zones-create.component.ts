import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-zones-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zones-create.component.html'
})
export class ZonesCreateComponent implements OnInit {

  warehouses: any[] = [];

  zone: any = {
    warehouse_id: '',
    zone_name: '',
    zone_type: '',
    product_category: '',
    status: 'Active'
  };

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.getWarehouses().subscribe({
      next: (res) => this.warehouses = res,
      error: (err) => console.error(err)
    });
  }

  saveZone(): void {
    console.log('Zone payload:', this.zone);

    this.dataService.createZone(this.zone).subscribe({
      next: () => {
        alert('Zone created successfully');
        this.router.navigate(['/dashboard/zones']);
      },
      error: (err) => {
        console.error(err);
        alert('Error creating zone');
      }
    });
  }
}
