import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logistics-entry.component.html'
})
export class LogisticsEntryComponent implements OnInit {

  mode: 'edit' | 'view' = 'view';
  data: any = {};

  transportTypes = ['Roadways', 'Railways', 'Seaway', 'Airway'];
  vehicleTypes = ['Truck', 'Van', 'Container', 'Train', 'Ship', 'Flight'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
  const id = Number(this.route.snapshot.paramMap.get('id'));

  if (id) {
    this.dataService.getLogisticsByProduct(id)
      .subscribe((res: any) => {
        this.data = res;
      });
  }
}

  save() {
    this.dataService.updateLogistics(this.data.product_id, this.data)
      .subscribe(() => this.router.navigate(['/dashboard/logistics']));
  }
}
