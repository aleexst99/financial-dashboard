import { Route } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () =>
      loadRemoteModule('dashboard', './BalanceSummary').then(m => m.BalanceSummary),
  },
];