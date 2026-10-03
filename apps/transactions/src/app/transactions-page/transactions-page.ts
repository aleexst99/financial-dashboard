import { Component } from '@angular/core';
import { TransactionForm } from '../transaction-form/transaction-form';
import { TransactionsList } from '../transactions-list/transactions-list';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [TransactionForm, TransactionsList],
  templateUrl: './transactions-page.html',
  styleUrl: './transactions-page.scss',
})
export class TransactionsPage {}