import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-logistics-list',
  standalone: true,                        // 🔥 REQUIRED
  imports: [CommonModule, RouterModule],   // 🔥 REQUIRED
  templateUrl: './logistics-list.component.html'
})
export class LogisticsListComponent implements OnInit, OnDestroy {

  logistics: any[] = [];
  private timer: any;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLogistics();

    // live remaining time refresh
    this.timer = setInterval(() => {}, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  loadLogistics(): void {
  this.dataService.getLogisticsList()
    .subscribe(res => this.logistics = res || []);
}

  /* REMAINING TIME */
  getRemainingTime(deliveryDate: string): string {
    if (!deliveryDate) return '-';

    const diff = new Date(deliveryDate).getTime() - Date.now();
    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  /* ACTIONS */
view(id: number): void {
  if (!id) {
    console.error('View clicked with invalid id', id);
    return;
  }
  this.router.navigate(['/dashboard/logistics/view', id]);
}

edit(id: number): void {
  if (!id) {
    console.error('Edit clicked with invalid id', id);
    return;
  }
  this.router.navigate(['/dashboard/logistics/edit', id]);
}

remove(id: number): void {
  if (!id) {
    console.error('Delete clicked with invalid id', id);
    return;
  }

  if (!confirm('Are you sure you want to delete this logistics?')) return;

  this.dataService.deleteLogistics(id).subscribe(() => {
    alert('Logistics deleted');
    this.loadLogistics();
  });
}
}
