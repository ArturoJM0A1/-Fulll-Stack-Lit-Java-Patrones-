import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard-page.component').then((module) => module.DashboardPageComponent)
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./features/products/products-page.component').then((module) => module.ProductsPageComponent)
  },
  {
    path: 'reportes',
    loadComponent: () =>
      import('./features/reports/reports-page.component').then((module) => module.ReportsPageComponent)
  },
  { path: '**', redirectTo: '' }
];
