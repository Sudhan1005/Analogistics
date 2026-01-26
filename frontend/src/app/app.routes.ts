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
import { ProductListComponent } from './products/product-list.component';

/* Delivery */
import { DeliveryListComponent } from './delivery/delivery-list.component';
import { DeliveryFormComponent } from './delivery/delivery-form.component';

/* Delivery Slots */
import { DeliverySlotListComponent } from './delivery/delivery-slot-list.component';
import { DeliverySlotCreateComponent } from './delivery/delivery-slot-create.component';

/* Drivers */
import { DriverListComponent } from './drivers/driver-list.component';
import { DriverFormComponent } from './drivers/driver-form.component';
/*Logistics*/
import { LogisticsListComponent } from './logistics/logistics-list.component';
import { LogisticsEntryComponent } from './logistics/logistics-entry.component';
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

      /* ===== WAREHOUSES ===== */
      { path: 'warehouses', component: WarehouseListComponent },
      { path: 'warehouses/create', component: WarehouseCreateComponent },

      /* ===== ZONES ===== */
      { path: 'zones', component: ZonesListComponent },
      { path: 'zones/create', component: ZonesCreateComponent },

      /* ===== PRODUCTS ===== */
      { path: 'products', component: ProductListComponent },
      { path: 'products/create', component: ProductEntryComponent },
      { path: 'products/edit/:id', component: ProductEntryComponent },
      { path: 'products/view/:id', component: ProductEntryComponent },

      /* ===== DELIVERY ===== */
      { path: 'delivery', component: DeliveryListComponent },
      { path: 'delivery/edit/:id', component: DeliveryFormComponent },
      { path: 'delivery/view/:id', component: DeliveryFormComponent },

      /* ===== DELIVERY SLOTS ===== */
      { path: 'delivery-slots', component: DeliverySlotListComponent },
      { path: 'delivery-slots/create', component: DeliverySlotCreateComponent },
      { path: 'delivery-slots/edit/:id', component: DeliverySlotCreateComponent },
      { path: 'delivery-slots/view/:id', component: DeliverySlotCreateComponent },

      /* ===== DRIVERS ===== */
      { path: 'drivers', component: DriverListComponent },
      { path: 'drivers/create', component: DriverFormComponent },
      { path: 'drivers/edit/:id', component: DriverFormComponent },
      { path: 'drivers/view/:id', component: DriverFormComponent },

    // =========================
  // LOGISTICS LIST
  // =========================
  {
    path: 'logistics',
    component: LogisticsListComponent
  },

  // =========================
  // LOGISTICS VIEW
  // =========================
  {
    path: 'logistics/view/:id',
    component: LogisticsEntryComponent
  },

  // =========================
  // LOGISTICS EDIT
  // =========================
  {
    path: 'logistics/edit/:id',
    component: LogisticsEntryComponent
  },

  // =========================
  // DEFAULT ROUTE
  // =========================
  {
    path: '',
    redirectTo: 'logistics',
    pathMatch: 'full'
  },

  // =========================
  // FALLBACK ROUTE
  // =========================
  {
    path: '**',
    redirectTo: 'logistics'
  },
      /* ===== DEFAULT DASHBOARD ===== */
      { path: '', redirectTo: 'warehouses', pathMatch: 'full' }
    ]
  },

  /* ================= DEFAULT ================= */
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  /* ================= FALLBACK ================= */
  { path: '**', redirectTo: 'login' }
];
