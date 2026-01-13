import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-delivery-slot-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './delivery-slot-list.component.html'
})
export class DeliverySlotListComponent implements OnInit {

  slots: any[] = [];

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSlots();
  }

  loadSlots() {
    this.dataService.getDeliverySlots().subscribe(res => {
      this.slots = res;
    });
  }

  view(id: number) {
    this.router.navigate(['/dashboard/delivery-slots/view', id]);
  }

  edit(id: number) {
    this.router.navigate(['/dashboard/delivery-slots/edit', id]);
  }

  delete(id: number) {
    if (confirm('Delete this delivery slot?')) {
      this.dataService.deleteDeliverySlot(id).subscribe(() => {
        this.loadSlots();
      });
    }
  }
}
