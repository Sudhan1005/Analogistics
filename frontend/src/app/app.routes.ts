import { Routes } from '@angular/router';

/* Auth */
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

/* Dashboard */
import { DashboardComponent } from './dashboard/dashboard.component';

/* Warehouses */
import { WarehouseListComponent } from './warehouse/warehouse-list.component';
import { WarehouseCreateComponent } from './warehouse/warehouse-create.component';

/* Zones */
import { ZonesListComponent } from './zones/zones-list.component';
import { ZonesCreateComponent } from './zones/zones-create.component';

/* Products */
import { ProductEntryComponent } from './products/product-entry.component';

/* Guard */
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  /* ================= AUTH ================= */
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  /* ================= DASHBOARD ================= */
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'warehouses', component: WarehouseListComponent },
      { path: 'warehouses/create', component: WarehouseCreateComponent },

      { path: 'zones', component: ZonesListComponent },
      { path: 'zones/create', component: ZonesCreateComponent },

      { path: 'products/create', component: ProductEntryComponent }, // ✅ FIXED

      { path: '', redirectTo: 'warehouses', pathMatch: 'full' }
    ]
  },

  /* ================= DEFAULT ================= */
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  /* ================= FALLBACK ================= */
  { path: '**', redirectTo: 'login' }
];
