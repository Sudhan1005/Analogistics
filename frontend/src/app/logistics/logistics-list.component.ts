import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logistics-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logistics-list.component.html'
})
export class LogisticsListComponent implements OnInit {

  logistics: any[] = [];
  loading = true;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLogistics();
  }

  loadLogistics(): void {
    this.dataService.getLogisticsList().subscribe({
      next: (res) => {
        this.logistics = res || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  view(id: number): void {
    this.router.navigate(['/dashboard/logistics/view', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/dashboard/logistics/edit', id]);
  }
}
