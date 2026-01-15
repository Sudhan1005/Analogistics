import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './delivery-list.component.html'
})
export class DeliveryListComponent implements OnInit, OnDestroy {

  deliveries: any[] = [];
  drivers: any[] = [];
  slots: any[] = [];

  private timer: any;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();

    // refresh remaining time every second
    this.timer = setInterval(() => {}, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /* LOAD DATA */
  loadAll(): void {
    this.dataService.getDrivers()
      .subscribe(r => this.drivers = r || []);

    this.dataService.getDeliverySlots()
      .subscribe(r => this.slots = r || []);

    this.dataService.getDeliveryList()
      .subscribe(r => this.deliveries = r || []);
  }

  /* ASSIGN DELIVERY */
  assign(d: any): void {
    if (!d.driver_id || !d.delivery_slot_id) {
      alert('Please select both driver and delivery slot');
      return;
    }

    this.dataService.assignDelivery(d.id, {
      driver_id: d.driver_id,
      delivery_slot_id: d.delivery_slot_id
    }).subscribe(() => {
      this.loadAll();
    });
  }

  /* CHECK ASSIGNMENT */
  isAssigned(d: any): boolean {
  return d.status === 'Driver Assigned';
}

  /* STATUS BADGE */
  getStatusClass(status: string): string {
    switch (status) {
      case 'Driver Assigned':
        return 'bg-primary';

      case 'Outbound':
        return 'bg-secondary';

      case 'Out for Delivery':
        return 'bg-dark';

      case 'Delivered':
        return 'bg-success';

      default:
        return 'bg-light text-dark';
    }
  }

  /* REMAINING TIME */
  getRemainingTime(d: any): string {
    if (!d.delivery_date) return '-';

    const dateTime = d.delivery_time
      ? new Date(`${d.delivery_date}T${d.delivery_time}`)
      : new Date(`${d.delivery_date}T23:59:59`);

    const diffMs = dateTime.getTime() - Date.now();
    if (diffMs <= 0) return 'Expired';

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  getRemainingClass(d: any): string {
    if (!d.delivery_date) return '';

    const dateTime = d.delivery_time
      ? new Date(`${d.delivery_date}T${d.delivery_time}`)
      : new Date(`${d.delivery_date}T23:59:59`);

    const diff = dateTime.getTime() - Date.now();

    if (diff <= 0) return 'text-danger fw-bold';
    if (diff <= 3600000) return 'text-danger fw-bold';      // < 1 hour
    if (diff <= 86400000) return 'text-warning fw-bold';    // < 1 day
    return 'text-success fw-bold';
  }

  /* ACTIONS */
  viewDelivery(id: number): void {
    this.router.navigate(['/dashboard/delivery/view', id]);
  }

  editDelivery(id: number): void {
    this.router.navigate(['/dashboard/delivery/edit', id]);
  }

  deleteDelivery(id: number): void {
    if (!confirm('Delete this delivery?')) return;

    this.dataService.deleteDelivery(id)
      .subscribe(() => this.loadAll());
  }
}
