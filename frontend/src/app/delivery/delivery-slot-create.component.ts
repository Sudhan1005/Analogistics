import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-delivery-slot-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './delivery-slot-create.component.html'
})
export class DeliverySlotCreateComponent implements OnInit {

  slot: any = {
    slot_name: '',
    start_time: '',
    end_time: ''
  };

  isEdit = false;
  isView = false;
  slotId!: number;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef   // ✅ ADD THIS
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const path = this.route.snapshot.routeConfig?.path || '';

    if (id) {
      this.slotId = +id;
      this.isEdit = path.includes('edit');
      this.isView = path.includes('view');

      this.dataService.getDeliverySlotById(this.slotId).subscribe(res => {
        this.slot = res;

        // 🔥 FORCE UI REFRESH
        this.cdr.detectChanges();
      });
    }
  }

  saveSlot() {
    if (this.isEdit) {
      this.dataService.updateDeliverySlot(this.slotId, this.slot)
        .subscribe(() => this.router.navigate(['/dashboard/delivery-slots']));
    } else {
      this.dataService.createDeliverySlot(this.slot)
        .subscribe(() => this.router.navigate(['/dashboard/delivery-slots']));
    }
  }

  cancel() {
    this.router.navigate(['/dashboard/delivery-slots']);
  }
}
