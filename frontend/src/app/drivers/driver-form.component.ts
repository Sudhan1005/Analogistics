import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-driver-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './driver-form.component.html'
})
export class DriverFormComponent implements OnInit {

  driver: any = {
    driver_name: '',
    gender: '',
    email: '',
    phone: '',
    last_company: '',
    govt_id_type: '',
    govt_id_number: ''
  };

  isEdit = false;
  isView = false;
  driverId!: number;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const path = this.route.snapshot.routeConfig?.path || '';

    this.isEdit = path.includes('edit');
    this.isView = path.includes('view');

    if (id) {
      this.driverId = +id;
      this.loadDriver(this.driverId);
    }
  }

  loadDriver(id: number) {
    this.dataService.getDriverById(id).subscribe(res => {
      this.driver = res;
      this.cdr.detectChanges();
    });
  }

  submit() {
    if (this.isEdit) {
      this.dataService.updateDriver(this.driverId, this.driver)
        .subscribe(() => {
          alert('Driver updated');
          this.router.navigate(['/dashboard/drivers']);
        });
    } else {
      this.dataService.createDriver(this.driver)
        .subscribe(() => {
          alert('Driver created');
          this.router.navigate(['/dashboard/drivers']);
        });
    }
  }

  cancel() {
    this.router.navigate(['/dashboard/drivers']);
  }
}
