import { Component, signal, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TransactionsApiService, Transaction } from '../services/transactions-api.service';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './transactions-list.html',
  styleUrl: './transactions-list.scss',
})
export class TransactionsList implements OnInit {
  private readonly transactionsApi = inject(TransactionsApiService);

  protected readonly transactions = signal<Transaction[]>([]);
  protected readonly loading = signal(true);
  protected readonly total = signal(0);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.transactionsApi.getAll({ limit: 20 }).subscribe({
      next: (response) => {
        this.transactions.set(response.data);
        this.total.set(response.meta.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}