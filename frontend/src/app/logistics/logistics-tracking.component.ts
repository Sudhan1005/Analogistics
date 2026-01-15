import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  standalone: true,
  selector: 'app-logistics-tracking',
  imports: [CommonModule],
  templateUrl: './logistics-tracking.component.html'
})
export class LogisticsTrackingComponent implements OnInit {

  cards: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
  this.dataService.getLogisticsTracking()
    .subscribe((res: any[]) => {
      this.cards = res;
    });

  setInterval(() => {}, 1000);
}

  getRemainingTime(d: any): string {
    const dt = new Date(`${d.delivery_date}T${d.delivery_time}`);
    const diff = dt.getTime() - Date.now();
    if (diff <= 0) return 'Delivered';

    const s = Math.floor(diff / 1000);
    return `${Math.floor(s/86400)}d ${Math.floor(s%86400/3600)}h ${Math.floor(s%3600/60)}m ${s%60}s`;
  }
}
