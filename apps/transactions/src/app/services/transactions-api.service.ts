import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
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

  getAll(params: { type?: string; category?: string; page?: number; limit?: number } = {}): Observable<TransactionsResponse> {
    let httpParams = new HttpParams();

    if (params.type) httpParams = httpParams.set('type', params.type);
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);

    return this.http.get<TransactionsResponse>(this.baseUrl, { params: httpParams });
  }
}