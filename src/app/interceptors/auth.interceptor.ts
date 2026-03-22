import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiService } from '../schematrix/services/api.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const apiService = inject(ApiService);

    let request = req;
    const hasToken = !!apiService.login?.Token;
    const isApiRequest = !!apiService.baseUrl && req.url.startsWith(apiService.baseUrl);

    if (hasToken && isApiRequest) {
        request = req.clone({
            setHeaders: {
                Authorization: `Bearer ${apiService.login.Token}`
            }
        });
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && apiService.isLoggedIn) {
                apiService.onError('Session is invalid. Please log in.');
                apiService.logout();
            }
            return throwError(() => error);
        })
    );
};
