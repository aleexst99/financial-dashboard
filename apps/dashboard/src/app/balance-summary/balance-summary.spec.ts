import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BalanceSummary } from './balance-summary';

describe('BalanceSummary', () => {
  let fixture: ComponentFixture<BalanceSummary>;
  let httpMock: HttpTestingController;

  const matchTransactionsRequest = (req: { url: string }) =>
    req.url.startsWith('http://localhost:3000/api/transactions');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceSummary],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(BalanceSummary);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('shows the loading state until the response arrives', () => {
    expect(fixture.nativeElement.textContent).toContain('Cargando saldo');

    httpMock.expectOne(matchTransactionsRequest).flush({
      data: [],
      meta: { total: 0, page: 1, limit: 100, totalPages: 0 },
    });
  });

  it('computes the balance as income minus expenses', () => {
    httpMock.expectOne(matchTransactionsRequest).flush({
      data: [
        { id: '1', amount: '45.50', type: 'expense', category: 'food', date: '2026-09-01' },
        { id: '2', amount: '2000.00', type: 'income', category: 'salary', date: '2026-09-01' },
      ],
      meta: { total: 2, page: 1, limit: 100, totalPages: 1 },
    });

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('1,954.50');
    expect(fixture.nativeElement.textContent).not.toContain('Cargando saldo');
  });
});
