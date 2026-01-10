import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-product-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-entry.component.html'
})
export class ProductEntryComponent implements OnInit {

  warehouses: any[] = [];

  statuses = [
    'Inbound',
    'Outbound',
    'Storage',
    'Delivery Assigned',
    'Out for Delivery',
    'Driver Yet to Assign',
    'Driver Assigned',
    'Logistics Ongoing',
    'Delivered'
  ];

  product: any = {
    warehouse_id: '',
    product_name: '',
    product_type: '',
    product_category: '',
    quantity: '',
    order_date: '',
    order_time: '',
    delivery_date: '',
    delivery_time: '',
    status: ''
  };

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dataService.getWarehouses().subscribe(res => {
      this.warehouses = res;
    });
  }

  saveProduct(): void {
    console.log('Product payload:', this.product);

    this.dataService.createProduct(this.product).subscribe({
      next: () => {
        alert('Product entry saved successfully');
        this.router.navigate(['/dashboard/products']);
      },
      error: () => alert('Error saving product')
    });
  }
}
