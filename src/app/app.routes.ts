import { Routes } from '@angular/router';
import { authGuard } from './core/route-guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: 'tasks',
        loadComponent: () =>
          import('./pages/dashboard/tasks/tasks.component').then(
            (m) => m.TasksComponent
          ),
      },
      {
        path: 'stats',
        loadComponent: () =>
          import('./pages/dashboard/stats/stats.component').then(
            (m) => m.StatsComponent
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
];
