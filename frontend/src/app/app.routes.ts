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
/* Delivery Slots*/
import { DeliverySlotListComponent } from './delivery/delivery-slot-list.component';
import { DeliverySlotCreateComponent } from './delivery/delivery-slot-create.component';
/*Drivers */
import { DriverListComponent } from './drivers/driver-list.component';
import { DriverFormComponent } from './drivers/driver-form.component';

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

      /* Warehouses */
      { path: 'warehouses', component: WarehouseListComponent },
      { path: 'warehouses/create', component: WarehouseCreateComponent },

      /* Zones */
      { path: 'zones', component: ZonesListComponent },
      { path: 'zones/create', component: ZonesCreateComponent },

      /* Products */
      { path: 'products', component: ProductListComponent },
      { path: 'products/create', component: ProductEntryComponent },
      { path: 'products/edit/:id', component: ProductEntryComponent },
      { path: 'products/view/:id', component: ProductEntryComponent },

      /* Delivery */
      { path: 'delivery', component: DeliveryListComponent },
      /* Delivery Slots */
      { path: 'delivery-slots', component: DeliverySlotListComponent },
      { path: 'delivery-slots/create', component: DeliverySlotCreateComponent },
      { path: 'delivery-slots/edit/:id', component: DeliverySlotCreateComponent },
      { path: 'delivery-slots/view/:id', component: DeliverySlotCreateComponent },
      /* ================= DELIVERY ================= */
{ path: 'delivery', component: DeliveryListComponent },
{ path: 'delivery/view/:id', component: DeliveryFormComponent },
{ path: 'delivery/edit/:id', component: DeliveryFormComponent },
       /* ===== DRIVERS ===== */
    { path: 'drivers', component: DriverListComponent },
    { path: 'drivers/create', component: DriverFormComponent },
    { path: 'drivers/edit/:id', component: DriverFormComponent },
    { path: 'drivers/view/:id', component: DriverFormComponent },
    /* ================= LOGISTICS ================= */

{
  path: 'logistics/list',
  loadComponent: () =>
    import('./logistics/logistics-list.component')
      .then(m => m.LogisticsListComponent)
},

{
  path: 'logistics/assign/:productId',
  loadComponent: () =>
    import('./logistics/logistics-assign.component')
      .then(m => m.LogisticsAssignComponent)
},

{
  path: 'logistics/view/:id',
  loadComponent: () =>
    import('./logistics/logistics-assign.component')
      .then(m => m.LogisticsAssignComponent)
},

{
  path: 'logistics/edit/:id',
  loadComponent: () =>
    import('./logistics/logistics-assign.component')
      .then(m => m.LogisticsAssignComponent)
},

{
  path: 'logistics/tracking',
  loadComponent: () =>
    import('./logistics/logistics-tracking.component')
      .then(m => m.LogisticsTrackingComponent)
},

      /* Default dashboard route */
      { path: '', redirectTo: 'warehouses', pathMatch: 'full' }
    ]
  },

  /* ================= DEFAULT ================= */
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  /* ================= FALLBACK ================= */
  { path: '**', redirectTo: 'login' }
];
