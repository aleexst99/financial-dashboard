import { Route } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { authGuard } from './auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      loadRemoteModule('dashboard', './BalanceSummary').then((m) => m.BalanceSummary),
  },
  {
    path: 'transactions',
    canActivate: [authGuard],
    loadComponent: () =>
      loadRemoteModule('transactions', './TransactionsPage').then((m) => m.TransactionsPage),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      loadRemoteModule('profile', './ProfileForm').then((m) => m.ProfileForm),
  },
];