import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthActions } from './store/auth/auth.actions';
import { selectIsAuthenticated } from './store/auth/auth.selectors';
import { EventBusService } from '@financial-dashboard/shared-core';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly eventBus = inject(EventBusService);

  protected title = 'shell';
  protected readonly isAuthenticated = this.store.selectSignal(selectIsAuthenticated);
  protected readonly toastMessage = signal<string | null>(null);

  constructor() {
    this.eventBus.on('transaction-created').subscribe(() => {
      this.toastMessage.set('Transacción creada correctamente');
      setTimeout(() => this.toastMessage.set(null), 3000);
    });
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
    this.router.navigateByUrl('/login');
  }
}