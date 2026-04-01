import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('pdf_token');
  const router = inject(Router);
  const authService = inject(AuthService);

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Sessão expirada. Redirecting to login...');
        authService.logout(); 
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};