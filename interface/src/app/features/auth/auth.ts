import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<{ access_token: string }>(this.API_URL, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('pdf_token', response.access_token);
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