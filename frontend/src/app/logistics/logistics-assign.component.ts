import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-logistics-assign',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './logistics-assign.component.html'
})
export class LogisticsAssignComponent implements OnInit {

  logisticsId!: number | null;
  mode: 'create' | 'edit' | 'view' = 'create';
  isView = false;

  warehouses: any[] = [];
  zones: any[] = [];

  logistics = {
    id: null,
    delivery_id: null,
    from_warehouse_id: '',
    from_zone_id: '',
    to_warehouse_id: '',
    to_zone_id: '',
    vehicle_number: '',
    transportation_type: '',
    status: 'Logistics Ongoing'
  };

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const url = this.router.url;

      if (url.includes('/view/')) {
        this.mode = 'view';
        this.isView = true;
      } else if (url.includes('/edit/')) {
        this.mode = 'edit';
      }

      if (id) {
        this.logisticsId = Number(id);
        this.loadLogistics(this.logisticsId);
      }
    });

    this.loadWarehouses();
  }

  /* LOADERS */

  loadWarehouses() {
    this.dataService.getWarehouses()
      .subscribe((res: any[]) => this.warehouses = res);
  }

  loadZones(warehouseId: number) {
    if (!warehouseId) return;
    this.dataService.getZonesByWarehouse(Number(warehouseId))
      .subscribe((res: any[]) => this.zones = res);
  }

  loadLogistics(id: number) {
    this.dataService.getLogisticsById(id)
      .subscribe(res => {
        this.logistics = res;
        this.loadZones(Number(res.to_warehouse_id));
      });
  }

  /* SAVE */

  save() {
    if (this.isView) return;

    if (this.mode === 'edit' && this.logisticsId) {
      this.dataService
        .updateLogistics(this.logisticsId, this.logistics)
        .subscribe(() => {
          alert('Logistics updated');
          this.router.navigate(['/dashboard/logistics/list']);
        });
    } else {
      this.dataService
        .assignLogistics(this.logistics)
        .subscribe(() => {
          alert('Logistics assigned');
          this.router.navigate(['/dashboard/logistics/list']);
        });
    }
  }

  back() {
    this.router.navigate(['/dashboard/logistics/list']);
  }
}