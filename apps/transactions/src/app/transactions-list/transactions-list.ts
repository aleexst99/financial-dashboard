import { Component, signal, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, startWith, switchMap, Subject } from 'rxjs';
import { TransactionsApiService, Transaction } from '@financial-dashboard/shared-transactions';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './transactions-list.html',
  styleUrl: './transactions-list.scss',
})
export class TransactionsList implements OnInit {
  private readonly transactionsApi = inject(TransactionsApiService);
  private readonly reload$ = new Subject<void>();

  protected readonly typeControl = new FormControl<string>('');
  protected readonly categoryControl = new FormControl<string>('');

  protected readonly transactions = signal<Transaction[]>([]);
  protected readonly loading = signal(true);
  protected readonly total = signal(0);

  ngOnInit(): void {
    combineLatest([
      this.typeControl.valueChanges.pipe(startWith('')),
      this.categoryControl.valueChanges.pipe(startWith('')),
      this.reload$.pipe(startWith(undefined)),
    ])
      .pipe(
        debounceTime(300),
        switchMap(([type, category]) => {
          this.loading.set(true);
          return this.transactionsApi.getAll({
            type: type || undefined,
            category: category || undefined,
            limit: 20,
          });
        }),
      )
      .subscribe({
        next: (response) => {
          this.transactions.set(response.data);
          this.total.set(response.meta.total);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  reload(): void {
    this.reload$.next();
  }
}