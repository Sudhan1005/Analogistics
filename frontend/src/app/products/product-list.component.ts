import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {

  products: any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.dataService.getProducts().subscribe({
      next: (res) => {
        console.log('Products API response:', res); // 🔴 DEBUG
        this.products = res;
      },
      error: (err) => {
        console.error('Failed to load products', err);
      }
    });
  }

  viewProduct(id: number) {
    this.router.navigate(['/dashboard/products/view', id]);
  }

  editProduct(id: number) {
    this.router.navigate(['/dashboard/products/edit', id]);
  }

  deleteProduct(id: number): void {

  if (!confirm('Are you sure you want to delete this product?')) {
    return;
  }

  this.dataService.deleteProduct(id).subscribe({
    next: () => {
      alert('Product deleted successfully');

      // 🔄 Reload list instantly
      this.loadProducts();
    },
    error: () => alert('Error deleting product')
  });
}


  getStatusClass(status: string): string {
    switch (status) {
      case 'Inbound': return 'bg-info';
      case 'Outbound': return 'bg-secondary';
      case 'Storage': return 'bg-warning text-dark';
      case 'Delivery Assigned': return 'bg-primary';
      case 'Out for Delivery': return 'bg-dark';
      case 'Driver Yet to Assign': return 'bg-danger';
      case 'Driver Assigned': return 'bg-secondary';
      case 'Logistics Ongoing': return 'bg-warning text-dark';
      case 'Delivered': return 'bg-success';
      default: return 'bg-light text-dark';
    }
  }
}
