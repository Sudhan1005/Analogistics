import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery-list.component.html'
})
export class DeliveryListComponent implements OnInit, OnDestroy {

  deliveries: any[] = [];

  // 🔥 Used to trigger live countdown update
  now: Date = new Date();
  intervalId: any;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  /* ===================== INIT ===================== */

  ngOnInit(): void {
    this.loadDeliveries();

    // 🔁 update remaining time every second
    this.intervalId = setInterval(() => {
      this.now = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /* ===================== DATA ===================== */

  loadDeliveries() {
    // Only OUTBOUND products appear here
    this.dataService.getOutboundProductsForDelivery()
      .subscribe(res => {
        this.deliveries = res;
      });
  }

  /* ===================== STATUS BADGE ===================== */

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

  // ===============================
  // ⏳ LIVE REMAINING TIME
  // ===============================
  getRemainingTime(p: any): string {
    if (!p.delivery_date || !p.delivery_time) return '-';

    const now = new Date();
    const delivery = new Date(`${p.delivery_date}T${p.delivery_time}`);

    let diffMs = delivery.getTime() - now.getTime();

    const isOverdue = diffMs < 0;
    diffMs = Math.abs(diffMs);

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const seconds = Math.floor((diffMs / 1000) % 60);

    let time = '';
    if (days > 0) time += `${days}d `;
    if (hours > 0 || days > 0) time += `${hours}h `;
    time += `${minutes}m ${seconds}s`;

    return isOverdue ? `Overdue by ${time}` : `${time} left`;
  }

  getRemainingClass(p: any): string {
    if (!p.delivery_date || !p.delivery_time) return 'badge bg-secondary';

    const now = new Date();
    const delivery = new Date(`${p.delivery_date}T${p.delivery_time}`);
    const diffHrs = (delivery.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHrs < 0) return 'badge bg-danger';              // ❌ overdue
    if (diffHrs <= 24) return 'badge bg-warning text-dark'; // ⚠️ urgent
    return 'badge bg-success';                              // ✅ safe
  }

  /* ===================== ACTIONS ===================== */

  deleteDelivery(id: number) {
    if (confirm('Delete this delivery record?')) {
      this.dataService.deleteDelivery(id).subscribe(() => {
        this.loadDeliveries();
      });
    }
  }
}
