import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { ILoginRequest, ILoginResponse } from '../../shared/common/types/auth.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/auth/login`;

  login(credentials: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.API_URL, credentials).pipe(
      tap(response => {
        localStorage.setItem('pdf_token', response.accessToken);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('pdf_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('pdf_token');
  }
}