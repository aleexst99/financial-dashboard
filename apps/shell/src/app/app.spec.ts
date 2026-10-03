import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { App } from './app';
import { selectIsAuthenticated } from './store/auth/auth.selectors';

describe('App', () => {
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [{ selector: selectIsAuthenticated, value: false }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  it('shows navigation links', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Ir a Dashboard');
  });

  it('hides the logout button when not authenticated', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')).toBeNull();
  });

  it('shows the logout button when authenticated', () => {
    store.overrideSelector(selectIsAuthenticated, true);
    store.refreshState();

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')?.textContent).toContain('Cerrar sesión');
  });
});