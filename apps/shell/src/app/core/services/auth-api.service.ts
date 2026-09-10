import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/auth-api.model';

export interface MeResponse {
  id: string;
  email: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/auth';

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password });
  }

  me(token: string): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.baseUrl}/me`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
    });
  }
}