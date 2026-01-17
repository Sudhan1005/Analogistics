import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  standalone: true,
  selector: 'app-logistics-list',
  templateUrl: './logistics-list.component.html',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule   // 🚨 REQUIRED
  ]
})
export class LogisticsListComponent implements OnInit {

  list: any[] = [];

  transportTypes = ['Roadways', 'Railways', 'Airways', 'Seaways'];
  vehicleTypes = ['Truck', 'Van', 'Container', 'Mini Truck','train'];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  /* ================= LOAD LIST ================= */
  load(): void {
  this.dataService.getLogisticsList().subscribe({
    next: res => {
      console.log('LOGISTICS API RESPONSE:', res); // 👈 DEBUG
      this.list = res.map(r => ({
        ...r,
        is_logistics_assigned: !!r.logistics_id
      }));
    },
    error: err => console.error(err)
  });
}
  /* ================= SAVE (FIRST TIME) ================= */
  save(l: any): void {

    if (!l.transport_type || !l.vehicle_type || !l.vehicle_number) {
      alert('Please fill Transport, Vehicle Type and Vehicle Number');
      return;
    }

    const payload = {
      product_id: l.id,            // 🔑 VERY IMPORTANT
      transport_type: l.transport_type,
      vehicle_type: l.vehicle_type,
      vehicle_number: l.vehicle_number
    };

    this.dataService.saveLogistics(payload).subscribe({
      next: () => {
        alert('Logistics saved successfully');
        this.load(); // refresh list
      },
      error: (err: any) => {
        console.error(err);
        alert('Save failed');
      }
    });
  }

  /* ================= ACTIONS ================= */
  edit(productId: number): void {
    this.router.navigate(['/dashboard/logistics/edit', productId]);
  }

  view(productId: number): void {
    this.router.navigate(['/dashboard/logistics/view', productId]);
  }

  remove(productId: number): void {
    if (!confirm('Delete logistics record?')) return;

    this.dataService.deleteLogistics(productId).subscribe({
      next: () => this.load(),
      error: (err: any) => {
        console.error(err);
        alert('Delete failed');
      }
    });
  }

  /* ================= HELPERS ================= */
  getStatusClass(): string {
    return 'bg-dark';
  }
}
