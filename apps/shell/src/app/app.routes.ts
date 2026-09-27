import { Route } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    loadComponent: () =>
      loadRemoteModule('dashboard', './BalanceSummary').then(m => m.BalanceSummary),
  },
  {
    path: 'transactions',
    loadComponent: () =>
      loadRemoteModule('transactions', './TransactionsList').then(m => m.TransactionsList),
  },
  {
    path: 'profile',
    loadComponent: () =>
      loadRemoteModule('profile', './ProfileForm').then(m => m.ProfileForm),
  },
];