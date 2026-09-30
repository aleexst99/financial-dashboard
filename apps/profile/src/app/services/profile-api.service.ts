import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '@financial-dashboard/shared-transactions';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/users`;

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/me`);
  }

  updateProfile(name: string): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.baseUrl}/me`, { name });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.baseUrl}/me/password`, {
      currentPassword,
      newPassword,
    });
  }
}