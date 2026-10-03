import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './store/auth/auth.actions';
import { selectIsAuthenticated } from './store/auth/auth.selectors';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected title = 'shell';
  protected readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigateByUrl('/login');
  }
}