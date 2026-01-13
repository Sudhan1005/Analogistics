import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-product-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-entry.component.html'
})
export class ProductEntryComponent implements OnInit {

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

  warehouses: any[] = [];
  zones: any[] = [];
  statuses: string[] = [
  'Inbound',
  'Storage',
  'Outbound',
  'Delivery Assigned',
  'Driver Yet to Assign',
  'Driver Assigned',
  'Out for Delivery',
  'Logistics Ongoing',
  'Delivered'
];
productTypes: string[] = [
  'Raw Material',
  'Finished Goods',
  'Semi Finished',
  'Consumables'
];

productCategories: string[] = [
  'Electronics',
  'Food',
  'Clothing',
  'Apparel',
  'Pharmaceutical',
  'Machinery'
];
  isEdit = false;
  isView = false;
  isViewMode = false;

  productId!: number;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const path = this.route.snapshot.routeConfig?.path || '';

    this.isEdit = path.includes('edit');
    this.isView = path.includes('view');
    this.isViewMode = this.isView;

    // ✅ FIRST load warehouses
    this.dataService.getWarehouses().subscribe(whs => {
      this.warehouses = whs;

      // ✅ THEN load product if edit/view
      if (id) {
        this.productId = +id;
        this.loadProduct(this.productId);
      }
    });
  }

  /* ================= LOAD PRODUCT (FIXED ORDER) ================= */

loadProduct(id: number) {
  this.dataService.getProductById(id).subscribe(prod => {
    this.product = prod;

    // Load zones AFTER warehouse (unchanged)
    if (this.product.warehouse_id) {
      this.dataService
        .getZonesByWarehouse(this.product.warehouse_id)
        .subscribe(zs => {
          this.zones = zs;
          this.cdr.detectChanges();
        });
    } else {
      this.cdr.detectChanges();
    }
  });
}
  /* ================= WAREHOUSE CHANGE ================= */

  onWarehouseChange() {
    if (!this.product.warehouse_id) {
      this.zones = [];
      this.product.zone_id = '';
      return;
    }

    this.dataService
      .getZonesByWarehouse(this.product.warehouse_id)
      .subscribe(zs => {
        this.zones = zs;
        this.cdr.detectChanges();
      });
  }

  /* ================= SAVE ================= */

  submit() {
  if (this.isEdit) {
    this.dataService.updateProduct(this.productId, this.product)
      .subscribe(() => {
        alert('Product updated successfully');
        this.router.navigate(['/dashboard/products']);
      });
  } else {
    this.dataService.createProduct(this.product)
      .subscribe(() => {
        alert('Product created successfully');
        this.router.navigate(['/dashboard/products']);
      });
  }
}
  cancel() {
    this.router.navigate(['/dashboard/products']);
  }
}
