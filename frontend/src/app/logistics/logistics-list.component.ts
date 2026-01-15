import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-logistics-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './logistics-list.component.html'
})
export class LogisticsListComponent implements OnInit {

  list: any[] = [];

  transportTypes = ['Roadways', 'Railways', 'Seaway', 'Airway'];
  vehicleTypes = ['Truck', 'Van', 'Container', 'Ship', 'Flight', 'Train'];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.dataService.getLogisticsList()
      .subscribe((res: any[]) => this.list = res);
  }

  save(l: any) {
    this.dataService.updateLogistics(l.delivery_id, {
      transport_type: l.transport_type,
      vehicle_type: l.vehicle_type,
      vehicle_number: l.vehicle_number
    }).subscribe(() => {
      alert('Logistics updated');
      this.load();
    });
  }

  view(id: number) {
    this.router.navigate(['/dashboard/logistics/view', id]);
  }

  edit(id: number) {
    this.router.navigate(['/dashboard/logistics/edit', id]);
  }

  delete(id: number) {
    if (confirm('Remove logistics assignment?')) {
      this.dataService.deleteLogistics(id)
        .subscribe(() => this.load());
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Out for Delivery': return 'bg-dark';
      case 'Logistics Ongoing': return 'bg-warning text-dark';
      case 'Delivered': return 'bg-success';
      default: return 'bg-secondary';
    }
  }
  isLogisticsSaved(l: any): boolean {
  return !!(
    l.transport_type &&
    l.vehicle_type &&
    l.vehicle_number
  );
}

canShowSave(l: any): boolean {
  return !this.isLogisticsSaved(l);
}
}
