import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, TransactionsResponse } from './transaction.model';
import { API_BASE_URL } from './api-config';

export interface CreateTransactionPayload {
  amount: number;
  type: Transaction['type'];
  category: string;
  description?: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class TransactionsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/transactions`;

  getAll(params: { type?: string; category?: string; page?: number; limit?: number } = {}): Observable<TransactionsResponse> {
    let httpParams = new HttpParams();

    if (params.type) httpParams = httpParams.set('type', params.type);
    if (params.category) httpParams = httpParams.set('category', params.category);
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);

    return this.http.get<TransactionsResponse>(this.baseUrl, { params: httpParams });
  }

  create(payload: CreateTransactionPayload): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, payload);
  }
}