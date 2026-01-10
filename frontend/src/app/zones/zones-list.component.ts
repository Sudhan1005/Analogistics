import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zones-list.component.html'
})
export class ZonesListComponent implements OnInit {

  zones: any[] = [];   // ✅ DECLARED

  constructor(private dataService: DataService) {}
  
ngOnInit() {
  this.dataService.getZones().subscribe(res => {
    this.zones = res;
  });
}


  loadZones(): void {
    this.dataService.getZones().subscribe({
      next: (res: any[]) => {
        this.zones = res;
      },
      error: (err: any) => {
        console.error('Zones list error:', err);
      }
    });
  }
}
