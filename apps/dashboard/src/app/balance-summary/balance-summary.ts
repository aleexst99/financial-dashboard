import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-balance-summary',
  standalone: true,
  templateUrl: './balance-summary.html',
  styleUrl: './balance-summary.scss',
})
export class BalanceSummary {
  protected readonly balance = signal(4523.87);
  protected readonly currency = signal('EUR');
}