import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-logistics-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logistics-entry.component.html'
})
export class LogisticsEntryComponent implements OnInit {

  /* ===== REQUIRED FLAGS (THIS FIXES YOUR ERROR) ===== */
  isEdit = false;
  isView = false;

  /* ===== DATA ===== */
  logistics: any = null;
  warehouses: any[] = [];
  zones: any[] = [];

  statuses = ['Pending', 'Out for Delivery', 'Delivered'];
  transportTypes = ['Truck', 'Van', 'Bike'];

  private logisticsId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.logisticsId = Number(this.route.snapshot.paramMap.get('id'));

    /* MODE DETECTION */
    if (this.router.url.includes('/edit')) {
      this.isEdit = true;
    } else {
      this.isView = true;
    }

    this.loadWarehouses();
    this.loadLogistics();
  }

  /* ===== LOADERS ===== */

  loadWarehouses() {
    this.dataService.getWarehouses().subscribe(res => {
      this.warehouses = res;
    });
  }

  loadLogistics() {
    this.dataService.getLogisticsById(this.logisticsId).subscribe(res => {
      this.logistics = res;

      if (this.logistics?.warehouse_id) {
        this.onWarehouseChange();
      }
    });
  }

  onWarehouseChange() {
    if (!this.logistics?.warehouse_id) return;

    this.dataService
      .getZonesByWarehouse(this.logistics.warehouse_id)
      .subscribe(res => {
        this.zones = res;
      });
  }

  /* ===== ACTIONS ===== */

  update() {
    this.dataService
      .updateLogistics(this.logisticsId, this.logistics)
      .subscribe(() => {
        this.router.navigate(['/dashboard/logistics']);
      });
  }

  back() {
    this.router.navigate(['/dashboard/logistics']);
  }
}
