import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WarehouseListComponent } from './warehouse/warehouse-list.component';
import { WarehouseCreateComponent } from './warehouse/warehouse-create.component';
import { HubsListComponent } from './hubs/hubs-list.component';
import { HubsCreateComponent } from './hubs/hubs-create.component';

export const routes: Routes = [

  // 🔐 AUTH PAGES
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 📊 DASHBOARD (AFTER LOGIN)
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'warehouses', component: WarehouseListComponent },
      { path: 'warehouses/create', component: WarehouseCreateComponent },
      { path: 'hubs', component: HubsListComponent },
      { path: 'hubs/create', component: HubsCreateComponent }
    ]
  },

  // 🟢 DEFAULT ROUTE (START HERE)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ❓ FALLBACK
  { path: '**', redirectTo: 'login' }
];
