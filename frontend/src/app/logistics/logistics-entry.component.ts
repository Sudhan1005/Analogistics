import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-logistics-entry',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './logistics-entry.component.html'
})
export class LogisticsEntryComponent implements OnInit {

  logistics: any = {
    warehouse_id: null,
    zone_id: null,
    product_name: '',
    product_type: '',
    product_category: '',
    quantity: null,
    delivery_date: '',
    delivery_time: '',
    transport_type: '',
    vehicle_type: '',
    vehicle_number: '',
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

  isEdit = false;
  isView = false;
  isLoaded = false;

  productId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const url = this.router.url;

    this.isEdit = url.includes('/edit/');
    this.isView = url.includes('/view/');
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadPageData();
  }

  loadPageData(): void {
    this.isLoaded = false;

    this.dataService.getWarehouses().subscribe(w => {
      this.warehouses = w;

      this.dataService.getLogisticsById(this.productId).subscribe(res => {
        this.logistics = { ...this.logistics, ...res };

        if (this.logistics.warehouse_id) {
          this.dataService
            .getZonesByWarehouse(this.logistics.warehouse_id)
            .subscribe(z => {
              this.zones = z;
              this.finishLoad();
            });
        } else {
          this.finishLoad();
        }
      });
    });
  }

  finishLoad(): void {
    this.isLoaded = true;
    this.cdr.detectChanges(); // 🔥 THIS IS THE KEY FIX
  }

  onWarehouseChange(): void {
    if (!this.logistics.warehouse_id) return;

    this.dataService
      .getZonesByWarehouse(this.logistics.warehouse_id)
      .subscribe(z => {
        this.zones = z;
        this.cdr.detectChanges();
      });
  }

  update(): void {
    this.dataService
      .updateLogistics(this.productId, this.logistics)
      .subscribe(() => {
        alert('Logistics updated successfully');
        this.router.navigate(['/dashboard/logistics']);
      });
  }

  back(): void {
    this.router.navigate(['/dashboard/logistics']);
  }
}
