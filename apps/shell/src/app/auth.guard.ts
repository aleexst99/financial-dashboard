import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { selectIsAuthenticated, selectSessionChecked } from './store/auth/auth.selectors';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const sessionChecked = toObservable(store.selectSignal(selectSessionChecked));
  const isAuthenticated = store.selectSignal(selectIsAuthenticated);

  return sessionChecked.pipe(
    filter((checked) => checked),
    take(1),
    map(() => isAuthenticated() || router.createUrlTree(['/login'])),
  );
};