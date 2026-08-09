import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from './auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User; token: string }>(),
    'Login Failure': props<{ error: string }>(),
    Logout: emptyProps(),
  },
});