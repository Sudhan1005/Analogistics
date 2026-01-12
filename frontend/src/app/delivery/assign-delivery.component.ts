import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-assign-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './assign-delivery.component.html'
})
export class AssignDeliveryComponent implements OnInit {

  isEdit = false;
  deliveryId!: number;

  delivery: any = {
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
    driver_name: '',
    delivery_slot: '',
    status: 'Assigned'
  };

  drivers = ['Ravi', 'Kumar', 'Suresh', 'Arun'];
  slots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  warehouses: any[] = [];
  zones: any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();

    this.deliveryId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.deliveryId) {
      this.isEdit = true;
      this.loadDelivery(this.deliveryId);
    }
  }

  loadWarehouses() {
    this.dataService.getWarehouses().subscribe(res => {
      this.warehouses = res;
    });
  }

  onWarehouseChange() {
    if (this.delivery.warehouse_id) {
      this.dataService
        .getZonesByWarehouse(this.delivery.warehouse_id)
        .subscribe(res => this.zones = res);
    }
  }

  loadDelivery(id: number) {
    this.dataService.getDeliveryById(id).subscribe(res => {
      this.delivery = res;
      this.onWarehouseChange();
    });
  }

  submit() {
    if (this.isEdit) {
      this.dataService.updateDelivery(this.deliveryId, this.delivery)
        .subscribe(() => {
          alert('Delivery Updated');
          this.router.navigate(['/dashboard/delivery']);
        });
    } else {
      this.dataService.createDelivery(this.delivery)
        .subscribe(() => {
          alert('Delivery Assigned');
          this.router.navigate(['/dashboard/delivery']);
        });
    }
  }
  cancel() {
  this.router.navigate(['/dashboard/delivery']);
}
}
