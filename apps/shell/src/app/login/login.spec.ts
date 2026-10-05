import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Login } from './login';
import { selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../store/auth/auth.selectors';

describe('Login', () => {
  async function setup() {
    return render(Login, {
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectAuthLoading, value: false },
            { selector: selectAuthError, value: null },
            { selector: selectIsAuthenticated, value: false },
          ],
        }),
      ],
    });
  }

  it('disables the submit button when the form is empty', async () => {
    await setup();

    const button = screen.getByRole('button', { name: /entrar/i });
    expect(button).toBeDisabled();
  });

  it('shows a validation message for an invalid email once touched', async () => {
    const user = userEvent.setup();
    await setup();

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'not-an-email');
    await user.tab();

    expect(screen.getByText(/introduce un email válido/i)).toBeInTheDocument();
  });

  it('enables the submit button once the form is valid', async () => {
    const user = userEvent.setup();
    await setup();

    await user.type(screen.getByLabelText(/email/i), 'alex@test.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');

    const button = screen.getByRole('button', { name: /entrar/i });
    expect(button).toBeEnabled();
  });

  it('shows the backend error message when present', async () => {
    const { fixture } = await render(Login, {
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectAuthLoading, value: false },
            { selector: selectAuthError, value: 'Invalid credentials' },
            { selector: selectIsAuthenticated, value: false },
          ],
        }),
      ],
    });
    fixture.detectChanges();

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});