import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, switchMap } from 'rxjs';
import { selectAccessToken } from '../../store/auth/auth.selectors';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(selectAccessToken).pipe(
    take(1),
    switchMap((token) => {
      console.log('[authInterceptor] URL:', req.url, '| token:', token);
      if (token) {
        const cloned = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        });
        return next(cloned);
      }
      return next(req);
    }),
  );
};