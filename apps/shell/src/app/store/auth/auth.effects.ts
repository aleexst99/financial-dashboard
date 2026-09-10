import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, catchError, switchMap, of } from 'rxjs';
import { AuthActions } from './auth.actions';
import { AuthApiService } from '../../core/services/auth-api.service';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authApi = inject(AuthApiService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authApi.login(email, password).pipe(
          switchMap((loginResponse) =>
            this.authApi.me(loginResponse.accessToken).pipe(
              map((user) =>
                AuthActions.loginSuccess({
                  user,
                  token: loginResponse.accessToken,
                }),
              ),
            ),
          ),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.error?.message ?? 'Login failed' })),
          ),
        ),
      ),
    ),
  );
}