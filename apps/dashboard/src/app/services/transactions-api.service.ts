import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

@Injectable({ providedIn: 'root' })
export class TransactionsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/transactions';

  getAll(): Observable<TransactionsResponse> {
    return this.http.get<TransactionsResponse>(`${this.baseUrl}?limit=100`);
  }
}