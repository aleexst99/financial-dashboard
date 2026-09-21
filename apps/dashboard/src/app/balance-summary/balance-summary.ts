import { Component, signal, inject, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TransactionsApiService } from '../services/transactions-api.service';

@Component({
  selector: 'app-balance-summary',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './balance-summary.html',
  styleUrl: './balance-summary.scss',
})
export class BalanceSummary implements OnInit {
  private readonly transactionsApi = inject(TransactionsApiService);

  protected readonly balance = signal(0);
  protected readonly currency = signal('EUR');
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.transactionsApi.getAll().subscribe({
      next: (response) => {
        const total = response.data.reduce((sum, t) => {
          const amount = parseFloat(t.amount);
          return t.type === 'income' ? sum + amount : sum - amount;
        }, 0);
        this.balance.set(total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}