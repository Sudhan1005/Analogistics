import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-delivery-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery-list.component.html'
})
export class DeliveryListComponent implements OnInit {

  deliveries: any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDeliveries();
  }

  loadDeliveries() {
  this.dataService.getOutboundProductsForDelivery()
    .subscribe(res => {
      this.deliveries = res;
    });
}

  /* STATUS CLASS (same as product list style) */
 getStatusClass(status: string) {
  switch (status) {
    case 'Inbound':
      return 'bg-info';

    case 'Outbound':
      return 'bg-secondary';

    case 'Storage':
      return 'bg-warning text-dark';

    case 'Delivery Assigned':
      return 'bg-primary';

    case 'Out for Delivery':
      return 'bg-dark';

    case 'Driver Yet to Assign':
      return 'bg-danger';

    case 'Driver Assigned':
      return 'bg-secondary';

    case 'Logistics Ongoing':
      return 'bg-warning text-dark';

    case 'Delivered':
      return 'bg-success';

    default:
      return 'bg-light text-dark';
  }
}

  /* ACTIONS */
  viewDelivery(id: number) {
    this.router.navigate(['/dashboard/delivery/view', id]);
  }

  editDelivery(id: number) {
    this.router.navigate(['/dashboard/delivery/edit', id]);
  }

  deleteDelivery(id: number) {
    if (confirm('Delete this delivery?')) {
      this.dataService.deleteDelivery(id).subscribe(() => {
        this.loadDeliveries();
      });
    }
  }
getRemainingTime(d: any): string {
  if (!d.delivery_date) return '-';

  const today = new Date();
  const deliveryDate = new Date(d.delivery_date);

  const diffTime = deliveryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Expired';
  if (diffDays === 0) return 'Today';
  return diffDays + ' Days';
}

getRemainingClass(d: any): string {
  const today = new Date();
  const deliveryDate = new Date(d.delivery_date);

  const diffTime = deliveryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'text-danger fw-bold';
  if (diffDays === 0) return 'text-warning fw-bold';
  if (diffDays <= 3) return 'text-warning';
  return 'text-success';
}
}
