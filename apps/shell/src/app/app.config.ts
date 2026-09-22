import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { appRoutes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthEffects } from './store/auth/auth.effects';
import { AuthActions } from './store/auth/auth.actions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({
      auth: authReducer,
    }),
    provideEffects([AuthEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
    provideAppInitializer(() => {
      const store = inject(Store);
      store.dispatch(AuthActions.restoreSession());
    }),
  ],
};