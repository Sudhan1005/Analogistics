import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './driver-list.component.html'
})
export class DriverListComponent implements OnInit {

  drivers: any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers() {
    this.dataService.getDrivers().subscribe(res => {
      this.drivers = res;
    });
  }

  view(id: number) {
    this.router.navigate(['/dashboard/drivers/view', id]);
  }

  edit(id: number) {
    this.router.navigate(['/dashboard/drivers/edit', id]);
  }

  remove(id: number) {
    if (confirm('Delete this driver?')) {
      this.dataService.deleteDriver(id).subscribe(() => {
        this.loadDrivers();
      });
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Available': return 'bg-success';
      case 'Driver Assigned': return 'bg-primary';
      case 'Out for Delivery': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  }
}
