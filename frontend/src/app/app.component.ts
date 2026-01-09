import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';
import { LoaderComponent } from './loader/loader.component';
import { LoaderService } from './services/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent, CommonModule],
  template: `
    <app-loader *ngIf="loading"></app-loader>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {

  loading = false;

  constructor(
    private router: Router,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loaderService.loading$.subscribe(value => {
      this.loading = value;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loaderService.show();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => this.loaderService.hide(), 600); // smooth finish
      }
    });
  }
}
