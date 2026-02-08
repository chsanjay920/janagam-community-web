import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const loginInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = sessionStorage.getItem('authToken');
  const router = inject(Router);
  let authReq = req;
  if (authToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          router.navigate(['/dashboard']);
        }
        sessionStorage.removeItem('token');
        return throwError(() => new Error(error.message));
      }),
    );
  }
  return next(req);
};
