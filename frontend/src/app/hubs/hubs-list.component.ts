import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../services/data.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hubs-list.component.html'
})
export class HubsListComponent implements OnInit {

  hubs: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadHubs();
  }

  loadHubs() {
    this.dataService.getHubs().subscribe({
      next: (res) => {
        console.log('Hubs API response:', res); // ✅ DEBUG
        this.hubs = res;
      },
      error: (err) => {
        console.error('Hubs API error:', err);
      }
    });
  }
}
