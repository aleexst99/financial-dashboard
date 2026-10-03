import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Login } from './login';
import { selectAuthError, selectAuthLoading, selectIsAuthenticated } from '../store/auth/auth.selectors';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
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
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('disables the submit button when the form is empty', () => {
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it('shows a validation message for an invalid email once touched', () => {
    const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
    emailInput.value = 'not-an-email';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Introduce un email válido');
  });

  it('enables the submit button once the form is valid', () => {
    const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
    const passwordInput = fixture.nativeElement.querySelector('input[type="password"]');

    emailInput.value = 'alex@test.com';
    emailInput.dispatchEvent(new Event('input'));
    passwordInput.value = 'password123';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(false);
  });

  it('shows the backend error message when present', () => {
    store.overrideSelector(selectAuthError, 'Invalid credentials');
    store.refreshState();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Invalid credentials');
  });
});