import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-product-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-entry.component.html'
})
export class ProductEntryComponent implements OnInit {

  /* ===== MODE HANDLING ===== */
  mode: 'create' | 'edit' | 'view' = 'create';
  isViewMode = false;
  productId!: number;

  /* ===== DROPDOWNS ===== */
  warehouses: any[] = [];
  zones: any[] = [];

  productTypes = [
    'Raw Material',
    'Finished Goods',
    'Perishable',
    'Fragile',
    'Hazardous'
  ];

  productCategories = [
    'Electronics',
    'FMCG',
    'Pharmaceuticals',
    'Apparel',
    'Cold Storage'
  ];

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

  /* ===== MODEL ===== */
  product: any = {
    warehouse_id: '',
    zone_id: '',
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
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

  // Detect mode
  const url = this.route.snapshot.url.join('/');

  if (url.includes('view')) {
    this.mode = 'view';
    this.isViewMode = true;
  } else if (url.includes('edit')) {
    this.mode = 'edit';
  }

  const id = this.route.snapshot.paramMap.get('id');
  this.productId = id ? Number(id) : 0;

  this.dataService.getWarehouses().subscribe({
    next: (res) => {
      this.warehouses = res;

      if (this.productId) {
        this.loadProduct(this.productId);
      }
    }
  });
  // Load warehouses FIRST
  this.dataService.getWarehouses().subscribe({
    next: (warehouses) => {
      this.warehouses = warehouses;

      // Load product AFTER warehouses
      if (this.productId) {
        this.loadProduct(this.productId);
      }
    },
    error: () => alert('Failed to load warehouses')
  });
}

  /* ===== LOAD PRODUCT FOR EDIT / VIEW ===== */
  loadProduct(id: number): void {
  this.dataService.getProductById(id).subscribe({
    next: (res) => {

      // 1️⃣ Normalize date fields (safety)
      this.product = {
        ...res,
        order_date: res.order_date?.substring(0, 10),
        delivery_date: res.delivery_date?.substring(0, 10)
      };

      // 2️⃣ Load zones AFTER warehouse is known
      this.dataService
        .getZonesByWarehouse(this.product.warehouse_id)
        .subscribe({
          next: (zones) => {
            this.zones = zones;

            // 3️⃣ Ensure zone binding AFTER zones load
            setTimeout(() => {
              this.product.zone_id = res.zone_id;
            });
          }
        });
    },
    error: () => {
      alert('Failed to load product details');
      this.router.navigate(['/dashboard/products']);
    }
  });
}
  /* ===== LOAD ZONES BY WAREHOUSE ===== */
  onWarehouseChange(): void {
    this.zones = [];
    this.product.zone_id = '';

    if (this.product.warehouse_id) {
      this.dataService
        .getZonesByWarehouse(this.product.warehouse_id)
        .subscribe(res => this.zones = res);
    }
  }

  /* ===== SAVE / UPDATE ===== */
  saveProduct(): void {

  if (this.isViewMode) return;

  if (this.mode === 'edit') {
    // 🔵 UPDATE
    this.dataService.updateProduct(this.productId, this.product).subscribe({
      next: () => {
        alert('Product updated successfully');
        this.router.navigate(['/dashboard/products']);
      },
      error: () => alert('Error updating product')
    });

  } else {
    // 🟢 CREATE
    this.dataService.createProduct(this.product).subscribe({
      next: () => {
        alert('Product created successfully');
        this.router.navigate(['/dashboard/products']);
      },
      error: () => alert('Error creating product')
    });
  }
}
}
