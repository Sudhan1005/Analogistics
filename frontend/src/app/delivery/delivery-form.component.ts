import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-delivery-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './delivery-form.component.html'
})
export class DeliveryFormComponent implements OnInit {

  delivery: any = null;

  warehouses: any[] = [];
  zones: any[] = [];
  drivers: any[] = [];
  slots: any[] = [];

  // ✅ SAME STATUS LIST AS PRODUCT ENTRY
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

  isEdit = false;
  isView = false;
  deliveryId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const path = this.route.snapshot.routeConfig?.path || '';
    const id = this.route.snapshot.paramMap.get('id');

    this.isEdit = path.includes('edit');
    this.isView = path.includes('view');

    if (!id) return;
    this.deliveryId = +id;

    // ✅ LOAD EVERYTHING TOGETHER (NO PARTIAL LOAD)
    forkJoin({
      delivery: this.dataService.getProductById(this.deliveryId),
      warehouses: this.dataService.getWarehouses(),
      drivers: this.dataService.getDrivers(),
      slots: this.dataService.getDeliverySlots()
    }).subscribe(res => {

      this.delivery = res.delivery;
      this.warehouses = res.warehouses;
      this.drivers = res.drivers;
      this.slots = res.slots;

      // load zones after warehouse known
      if (this.delivery.warehouse_id) {
        this.dataService
          .getZonesByWarehouse(this.delivery.warehouse_id)
          .subscribe(z => {
            this.zones = z;
            this.cdr.detectChanges();
          });
      } else {
        this.cdr.detectChanges();
      }
    });
  }

  onWarehouseChange(): void {
    if (!this.delivery.warehouse_id) return;

    this.dataService
      .getZonesByWarehouse(this.delivery.warehouse_id)
      .subscribe(z => this.zones = z);
  }

  update(): void {
    this.dataService
      .updateProduct(this.deliveryId, this.delivery)
      .subscribe(() => {
        alert('Delivery updated successfully');
        this.router.navigate(['/dashboard/delivery']);
      });
  }

  back(): void {
    this.router.navigate(['/dashboard/delivery']);
  }
}
